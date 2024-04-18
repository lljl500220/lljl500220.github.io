---
title: watch与watchEffect
icon: vue
prev: ./computed.md
---

今天我们一起来看一下watch与watchEffect的源码实现。
<!--more-->

## watch

### 用法

```typescript
const myName = ref('老罗')
//1 常用的监听Ref
// watch(myName, (newValue, oldValue) => {
//   console.log(newValue,oldValue)
// })
const myObj = ref({
    name: '小罗'
})
//这样是监听不到object类型的ref的
watch(myObj, (newValue, oldValue) => {
    console.log(newValue, oldValue)
})
//这样可以监听到整个代理对象 切记不能到基本类型的属性上去，因为属性上是没有effect和代理getter和setter方法的
//我们之前说effect的时候说过，track函数在收集依赖时，到最后剩下的是一个副作用函数。
watch(myObj.value, (newValue, oldValue) => {
    console.log(newValue, oldValue)
})
//可以监听多个
watch([myName, myObj.value], (newValue, oldValue) => {
    console.log(newValue, oldValue) //newValue是一个数组，包含了两个值
})
//2.监听reactive
const obj = reactive({
    name: {
        names: []
    },
})
//监听的是一整个代理对象，就好比ref.value 事实上从代理源代码来看，ref.value本来就是reactive的实现
watch(obj, (newValue, oldValue) => {
    console.log(newValue, oldValue)
})
//这样是不行的，与ref的属性相同，无法对一个基本类型进行监听
watch(obj.name, (newValue, oldValue) => {
    console.log(newValue, oldValue)
})
//针对对象中的属性，vue3提供了函数式写法 这样救能监听属性了
watch(() => obj.name, (newValue, oldValue) => {
    console.log(newValue, oldValue)
})

//3配置项
watch(myName, (newValue, oldValue) => {
    console.log(newValue, oldValue)
}, {
    immediate: tru, //立即执行一次
    deep: true, //深度监听
    flush: 'sync' //同步执行 'post' 在组件更新只后执行 'pre' 在组件更新前执行
})
```

### 源码

源码目录在/packages/runtime-core，watch呢是一个运行时方法。
```typescript
export function watch<T = any, Immediate extends Readonly<boolean> = false>(
    source: T | WatchSource<T>,
    cb: any,
    options?: WatchOptions<Immediate>
): WatchStopHandle {
    if (__DEV__ && !isFunction(cb)) {//主要是用来判断传入的cb是否是一个函数
        warn(
            `\`watch(fn, options?)\` signature has been moved to a separate API. ` +
            `Use \`watchEffect(fn, options?)\` instead. \`watch\` now only ` +
            `supports \`watch(source, cb, options?) signature.`
        )
    }
    return doWatch(source as any, cb, options) //返回一个doWatch的运行结果
}
```
doWatch内容相当之多，我先将代码拿出来，然后一点一点的说
```typescript
function doWatch(
    source: WatchSource | WatchSource[] | WatchEffect | object,
    cb: WatchCallback | null,
    { immediate, deep, flush, onTrack, onTrigger }: WatchOptions = EMPTY_OBJ
): WatchStopHandle {
    // 如果在开发环境中并且没有回调函数，那么就会发出警告
    if (__DEV__ && !cb) {
        if (immediate !== undefined) {
            warn(
                `watch() "immediate" option is only respected when using the ` +
                `watch(source, callback, options?) signature.`
            )
        }
        if (deep !== undefined) {
            warn(
                `watch() "deep" option is only respected when using the ` +
                `watch(source, callback, options?) signature.`
            )
        }
    }

    // 获取当前实例
    const instance = getCurrentScope() === currentInstance?.scope ? currentInstance : null

    let getter: () => any // 定义一个getter函数
    let forceTrigger = false // 是否强制触发
    let isMultiSource = false // 是否是多个source

    //这里开始处理不同的类型
    if (isRef(source)) {
        getter = () => source.value //getter返回ref的value
        forceTrigger = isShallow(source) //是否是浅层
    } else if (isReactive(source)) {
        getter = () => source //返回代理本身
        deep = true //默认会为reactive对象开启深层监听
    } else if (isArray(source)) { //处理监听多个的情况，其实就是在内部遍历了source
        isMultiSource = true
        forceTrigger = source.some(s => isReactive(s) || isShallow(s))
        getter = () =>
            source.map(s => {
                if (isRef(s)) {
                    return s.value
                } else if (isReactive(s)) {
                    return traverse(s) //这里呢就是一个递归，比较耗时
                } else if (isFunction(s)) {
                    return callWithErrorHandling(s, instance, ErrorCodes.WATCH_GETTER)
                } else {
                    __DEV__ && warnInvalidSource(s)
                }
            })
    } else if (isFunction(source)) {
        if (cb) {
            // getter with cb
            getter = () =>
                callWithErrorHandling(source, instance, ErrorCodes.WATCH_GETTER)
        } else { //什么都不是的话，就是一个简单的effect
            // no cb -> simple effect
            getter = () => {
                if (instance && instance.isUnmounted) {
                    return //当实例被卸载时，直接返回
                }
                if (cleanup) {
                    cleanup() //移除上一个effect
                }
                return callWithAsyncErrorHandling(
                    source,
                    instance,
                    ErrorCodes.WATCH_CALLBACK,
                    [onCleanup]
                )
            }
        }
    } else {
        getter = NOOP
        __DEV__ && warnInvalidSource(source)
    }

    // 2.x array mutation watch compat
    if (__COMPAT__ && cb && !deep) { //用了deep就需要遍历，所以这里是不支持的
        const baseGetter = getter
        getter = () => {
            const val = baseGetter()
            if (
                isArray(val) &&
                checkCompatEnabled(DeprecationTypes.WATCH_ARRAY, instance)
            ) {
                traverse(val)
            }
            return val
        }
    }

    if (cb && deep) { //遍历收集依赖
        const baseGetter = getter
        getter = () => traverse(baseGetter())
    }

    let cleanup: () => void
    let onCleanup: OnCleanup = (fn: () => void) => {
        cleanup = effect.onStop = () => {
            callWithErrorHandling(fn, instance, ErrorCodes.WATCH_CLEANUP)
        }
    }

    // in SSR there is no need to setup an actual effect, and it should be noop
    // unless it's eager or sync flush
    //ssr不管
    let ssrCleanup: (() => void)[] | undefined
    if (__SSR__ && isInSSRComponentSetup) {
        // we will also not call the invalidate callback (+ runner is not set up)
        onCleanup = NOOP
        if (!cb) {
            getter()
        } else if (immediate) {
            callWithAsyncErrorHandling(cb, instance, ErrorCodes.WATCH_CALLBACK, [
                getter(),
                isMultiSource ? [] : undefined,
                onCleanup
            ])
        }
        if (flush === 'sync') {
            const ctx = useSSRContext() as SSRContext
            ssrCleanup = ctx.__watcherHandles || (ctx.__watcherHandles = [])
        } else {
            return NOOP
        }
    }

    let oldValue: any = isMultiSource //收集旧值
        ? new Array((source as []).length).fill(INITIAL_WATCHER_VALUE)
        : INITIAL_WATCHER_VALUE
    //定义一个调度器
    const job: SchedulerJob = () => {
        if (!effect.active) { //如果effect不活跃，直接返回，相当于这个副作用函数不会再执行了
            return
        }
        if (cb) {
            // watch(source, cb)
            const newValue = effect.run() //与上节computed说到的是一样的，返回的是当前依赖的最新值
            if (
                deep ||
                forceTrigger ||
                (isMultiSource
                    ? (newValue as any[]).some((v, i) =>
                        hasChanged(v, (oldValue as any[])[i])
                    )
                    : hasChanged(newValue, oldValue)) ||
                (__COMPAT__ &&
                    isArray(newValue) &&
                    isCompatEnabled(DeprecationTypes.WATCH_ARRAY, instance))
            ) { // deep为true，或者强制触发，或者新旧值不相等，或者是数组且开启了兼容模式
                // cleanup before running cb again
                if (cleanup) { //清除上一个effect
                    cleanup()
                }

                //callWithAsyncErrorHandling用来捕获异常
                callWithAsyncErrorHandling(cb, instance, ErrorCodes.WATCH_CALLBACK, [
                    newValue,
                    // pass undefined as the old value when it's changed for the first time
                    oldValue === INITIAL_WATCHER_VALUE
                        ? undefined
                        : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE
                            ? []
                            : oldValue,
                    onCleanup
                ])
                oldValue = newValue
            }
        } else {
            // watchEffect
            //没有callback的情况还能走到这里，说明是一个watchEffect
            effect.run()
        }
    }

    // 定义一个调度器，它将根据flush选项来决定何时执行job
    let scheduler: EffectScheduler
    if (flush === 'sync') {
        scheduler = job as any // the scheduler function gets called directly
    } else if (flush === 'post') {
        //在源码中，queuePostRenderEffect只要出现，就一定是在组件更新之后执行传入函数
        scheduler = () => queuePostRenderEffect(job, instance && instance.suspense)
    } else {
        //默认就是在组件更新前执行
        job.pre = true
        if (instance) job.id = instance.uid
        scheduler = () => queueJob(job)
    }

    // 创建一个新的响应式effect
    const effect = new ReactiveEffect(getter, scheduler)

    // 初始运行
    if (cb) {
        if (immediate) {
            job()
        } else {
            oldValue = effect.run()
        }
    } else if (flush === 'post') {
        queuePostRenderEffect(
            effect.run.bind(effect),
            instance && instance.suspense
        )
    } else {
        effect.run()
    }

    // 定义一个unwatch函数，它将停止effect并从实例的effects列表中移除它
    const unwatch = () => {
        effect.stop()
        if (instance && instance.scope) {
            remove(instance.scope.effects!, effect)
        }
    }

    if (__SSR__ && ssrCleanup) ssrCleanup.push(unwatch)
    return unwatch
}
```

## watchEffect
### 用法
```typescript
const myName = ref('老罗')

const myObj = ref({
    name:'小罗'
})

const stop = watchEffect(()=>{
    console.log(myName.value + myObj.value.name)
})

const doClick = () =>{
    myName.value = '老罗喵喵'
}
//当然也能添加options
const stop = watchEffect(()=>{
    console.log(myName.value + myObj.value.name)
},{
    flush:'sync',
    onTrack:(e)=>{ //收集依赖时触发 e是一个对象，包含effect信息
        console.log('onTrack',e)
    },
    onTrigger:(e)=>{//effect触发时触发
        console.log('onTrigger',e)
    }
})
```

### 源码
源码就是上面的doWatch已经说过了。