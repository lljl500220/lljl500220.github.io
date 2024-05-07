---
title: computed
icon: vue
category: vue
tag:
- vue3
prev: ./reactive.md
next: ./watch.md
---

上一篇文章呢，我们讲了一下vue3的响应式原理，这一篇呢，我们来讲一下vue3中的计算属性computed。

<!-- more -->
## computed
计算属性呢是响应式的一大组成部分，在实际开发中也存在着非常高的使用频率，接下来我们说一下computed的两种实现。

### 选项式
```javascript
const obj = reactive({
    name:'老罗',
})

const age = ref(18)

const myName = computed({
    get:()=>{
        return obj.name + age.value
    },
    set:(val)=>{
        obj.name = val
    }
})

const doClick = ()=>{
    myName.value = '帅比'
}

const getName = ()=>{
    console.log(myName.value)
}
```

是的你没看错，上述代码对computed进行了赋值操作。有些朋友就会问了，为什么computed可以赋值呢？它不应该是只读的吗？这个问题我们后继看源码的时候再说。  

### 函数式
```javascript
const obj = reactive({
  name:'老罗',
})

const age = ref(18)

const myName = computed(()=>{
  return obj.name + age.value
})

const doClick = ()=>{
  myName.value = '帅比' //尝试分配给常量或只读变量
}

const getName = ()=>{
  console.log(myName.value)
}
```
现在呢doClick方法就会报错了，因为myName变成只读的了！奇不奇怪。ok，接下来呢我们一起通过源码来看看到底是为什么。

## 源码阅读
ok，还是打开我们的vue3源代码，定位到packages\reactivity\src\computed.ts文件，我们来看看computed的实现。  
直接定位到computed函数与它的重载函数，重载我们先不用管，回头再来看
```typescript
export function computed<T>(
    getterOrOptions: ComputedGetter<T> | WritableComputedOptions<T>, // 计算属性的getter或者setter，理应是一个方法
    debugOptions?: DebuggerOptions, // 调试选项
    isSSR = false // 是否是服务端渲染
) {
    let getter: ComputedGetter<T> // getter 其实就是选项式的get函数
    let setter: ComputedSetter<T> // setter

    /**
     * 先判断进来的参数是函数式的getter还是选项式的
     * 如果是函数式的，则将对象属性作为只读
     * 且只有getter，没有setter
     * **/
    const onlyGetter = isFunction(getterOrOptions)
    if (onlyGetter) {
        getter = getterOrOptions
        setter = __DEV__
            ? () => {
                console.warn('Write operation failed: computed value is readonly')
            }
            : NOOP
    } else {
        getter = getterOrOptions.get
        setter = getterOrOptions.set
    }

    //返回一个cRef
    const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR)

    //ssr我们不管
    if (__DEV__ && debugOptions && !isSSR) {
        cRef.effect.onTrack = debugOptions.onTrack
        cRef.effect.onTrigger = debugOptions.onTrigger
    }

    return cRef as any
}
```
从代码中可以看到返回了一个ComputedRefImpl对象，那就再看看这个对象是什么。  
还是在这个文件，大约是20行左右。
```typescript
export class ComputedRefImpl<T> {
  public dep?: Dep = undefined //const dep = new Set<ReactiveEffect>(effects) as Dep 其实就是上一篇文章中的effects收集的依赖

  private _value!: T // 缓存值
  public readonly effect: ReactiveEffect<T> // 响应式effect 收集依赖

  public readonly __v_isRef = true // 是否是ref
  public readonly [ReactiveFlags.IS_READONLY]: boolean = false // 是否是只读

  public _dirty = true // 是否是脏数据 用于缓存 为true时重新计算
  public _cacheable: boolean // 是否可以缓存

  constructor() {}

  get value() { //劫持了value，这就是为什么我们使用computed时需要加上.value才能访问
    const self = toRaw(this) //使用toRaw方法将当前实例脱离proxy代理 以便获取原始值
    trackRefValue(self) //收集依赖 这个track呢和我们上节讲的track实际是一个东西
    if (self._dirty || !self._cacheable) { //如果是脏数据或者不可缓存
      self._dirty = false //设置为非脏数据
      self._value = self.effect.run()! //重新计算 这个run方法我们等下说，先知道它就是用来获取计算属性的值
    }
    return self._value
  }

  set value(newValue: T) {
    this._setter(newValue)
  }
}
```
ok，我们来看一下self.effect.run()这行代码是做什么的，需要从构造函数开始看：
```typescript
  constructor(
    getter: ComputedGetter<T>,
    private readonly _setter: ComputedSetter<T>,
    isReadonly: boolean,
    isSSR: boolean
) {
    this.effect = new ReactiveEffect(getter, () => {
        if (!this._dirty) {
            this._dirty = true
            triggerRefValue(this)
        }
    })
    this.effect.computed = this
    this.effect.active = this._cacheable = !isSSR
    this[ReactiveFlags.IS_READONLY] = isReadonly
}
```
这是ComputedRefImpl类的构造函数，我们可以看到在构造函数中，我们实例化了一个ReactiveEffect对象，这个对象的作用是用来收集依赖的，和我们上次讲的
effect是一模一样的东西，但是它内部做了更多的判断，添加了一个调度，就是我们传入的getter方法，当我们调用run方法时，就会执行这个getter方法，然后
将这个方法添加到了effect的deps中，这样我们就可以在value中通过trackRefValue方法来收集依赖了。

ok，源码我们就讲到这里，接下来我们来手写一下这个computed的实现。

## 手写computed
还是延续之前的代码和项目结构，此处呢我不再叙述了，在packages/reactivity中新建一个computed.ts文件，我们来实现computed的功能。
```typescript
import { effect } from './effect';

export const computed = (getter: Function) => {
    let _value = effect(getter) // 这里的getter就是计算属性的getter

     class ComputedRefImpl{ // 计算属性的实现
        get value(){ // 计算属性的值
            return _value() //通过执行getter来获取计算属性的值
        }
    }

    return new ComputedRefImpl()
}
```
将逻辑简化后，我们就得到了这样一个具备完全功能的方法，由于现在effect需要返回一个函数，所以我们把上一次讲的effect函数再修改一下。
```typescript
export const effect = (fn: Function) => {
    const _effect = function (){
        activeEffect = _effect
        return fn()
    }

    _effect()

    return _effect
}
```
好，接下来我们来测试一下，还是在之前的html文件中引入。
```html
<div id="app">
    <button id="">change</button>
</div>
<script type="module">
    import {reactive, effect,computed} from "/packages/reactivity/dist/reactivity.esm-bundler.js";

    const obj = reactive({name: '老罗', age: 18});

    const realName = computed(() => {
        return obj.name + '真帅'
    })

    effect(() => {
        document.querySelector('#app').innerText = `${obj.name}, ${obj.age}, ${realName.value}`
    })

    setTimeout(() => {
        obj.name = 'luo'
    }, 2000)
</script>
```
执行后，页面上先显示老罗，18，老罗真帅，2秒后变成luo，18，luo真帅。这样我们就实现了一个简易的computed。