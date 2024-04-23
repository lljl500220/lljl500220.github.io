---
title: diff算法和ast
icon: vue
isOriginal: true
category: vue
tag:
  - vue3
---

vue3diff算法学习
<!-- more -->

## ast是什么

ast是抽象语法树的简写（abstract syntax code），vue操作dom的过程，就是将template转化为ast的过程，也就是虚拟dom。

:::info
事实上很多编译器都会将代码转化为ast，然后再进行操作，比如babel，typescript等等。
:::

## 为什么要用虚拟dom

一个dom的属性是非常多的，去操作dom比较的复杂，而且操作dom比较浪费性能和时间，但是js不一样。操作js非常快捷，并且性能很高，所以将dom转化为虚拟dom后，
通过js的方式，改变部分节点内容，要远比直接操作dom来得更加的快。

## vue3diff

一图表示

![diff算法](/carefree/diff.png)

## 源码

ok，依旧是来看一下源码。源码目录在runtime-core/src/renderer.ts。  
首先在大约1580行找到patchChildren函数，这个函数是diff算法的核心。

```typescript
 const patchChildren: PatchChildrenFn = (
    n1,  //旧的节点
        n2, //新的节点
        container, //容器
        anchor, //锚点
        parentComponent, //父组件
        parentSuspense, //父suspense suspense是一个内置组件 用于收集异步组件的依赖
        isSVG, //是否是svg元素
        slotScopeIds, //作用域插槽 ID
        optimized = false //是否执行优化
)
```

该函数调用时机在节点更新时，比如节点的属性变化，子节点的变化等等。可以看到，传入新旧节点，该新旧节点类型是VNode类型(
也就是虚拟节点)。
继续往下看

```typescript
const c1 = n1 && n1.children //旧的节点的子节点
const prevShapeFlag = n1 ? n1.shapeFlag : 0 //旧的节点的标记
const c2 = n2.children //新节点的子节点

const {patchFlag, shapeFlag} = n2 //patchFlag 表示新旧节点的差异
```

初始化了旧节点的子节点，旧节点的标记，新节点的子节点，新节点的patchFlag和shapeFlag。patchFlag是一个标记，表示新旧节点的差异，shapeFlag是一个标记，表示节点的类型。

```typescript
 if (patchFlag > 0) {
    if (patchFlag & PatchFlags.KEYED_FRAGMENT) {
        // this could be either fully-keyed or mixed (some keyed some not)
        // presence of patchFlag means children are guaranteed to be arrays
        patchKeyedChildren(
            c1 as VNode[],
            c2 as VNodeArrayChildren,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
        )
        return
    } else if (patchFlag & PatchFlags.UNKEYED_FRAGMENT) {
        // unkeyed
        patchUnkeyedChildren(
            c1 as VNode[],
            c2 as VNodeArrayChildren,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
        )
        return
    }
}
```

如果patchFlag大于0，表示新旧节点有差异，那么就会进入patchKeyedChildren或者patchUnkeyedChildren函数。patchKeyedChildren函数是用来处理有key的节点，patchUnkeyedChildren函数是用来处理没有key的节点。

实际上往后还有一种情况，当patchFlag不大于0时，需要去处理子节点：

```typescript
 //新节点的子节点有三种可能：文本、数组或没有子节点。
if (shapeFlag & ShapeFlags.TEXT_CHILDREN) { //新节点是文本节点
    // text children fast path
    if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) { // 旧节点是数组
        unmountChildren(c1 as VNode[], parentComponent, parentSuspense)
    }
    if (c2 !== c1) { // 子节点不同
        hostSetElementText(container, c2 as string)
    }
} else { //新节点不是文本节点
    if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) { // 旧节点是数组
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) { //新节点是数组
            // 两个数组类型的节点，将进行diff
            patchKeyedChildren(
                c1 as VNode[],
                c2 as VNodeArrayChildren,
                container,
                anchor,
                parentComponent,
                parentSuspense,
                isSVG,
                slotScopeIds,
                optimized
            )
        } else {
            // 没有新的子节点，将卸载旧的子节点
            unmountChildren(c1 as VNode[], parentComponent, parentSuspense, true)
        }
    } else {
        if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
            hostSetElementText(container, '')
        }
        // mount new if array
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
            mountChildren(
                c2 as VNodeArrayChildren,
                container,
                anchor,
                parentComponent,
                parentSuspense,
                isSVG,
                slotScopeIds,
                optimized
            )
        }
    }
}
```

其实是当patchFlag大于0时的处理差不多的。ok接下来呢就是我们diff算法的重要部分了，patchKeyedChildren和patchUnkeyedChildren函数。

### patchUnkeyedChildren

首先是一个没有key的情况，我们在开发的时候总会遇到一种提示，当我们使用v-for的时候，如果没有key，会有一个警告，这个警告是有道理的，因为没有key的话，diff算法会变得非常的低效。
下面我们一起看一下没有key的情况：

```typescript
const patchUnkeyedChildren = (
    c1: VNode[], //旧的
    c2: VNodeArrayChildren, //新的
    container: RendererElement,
    anchor: RendererNode | null,
    parentComponent: ComponentInternalInstance | null,
    parentSuspense: SuspenseBoundary | null,
    isSVG: boolean,
    slotScopeIds: string[] | null,
    optimized: boolean
) => {
    c1 = c1 || EMPTY_ARR
    c2 = c2 || EMPTY_ARR
    const oldLength = c1.length
    const newLength = c2.length
    const commonLength = Math.min(oldLength, newLength)
    let i
    for (i = 0; i < commonLength; i++) {
        const nextChild = (c2[i] = optimized
            ? cloneIfMounted(c2[i] as VNode)
            : normalizeVNode(c2[i]))
        patch(
            c1[i],
            nextChild,
            container,
            null,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
        )
    }
    if (oldLength > newLength) {
        // remove old
        unmountChildren(
            c1,
            parentComponent,
            parentSuspense,
            true,
            false,
            commonLength
        )
    } else {
        // mount new
        mountChildren(
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized,
            commonLength
        )
    }
}
```

相当简单哈，按照[图里](#vue3diff)的没有key的情况，就是替换，删除，添加，没有其它的算法。

### patchKeyedChildren

接下来是有key的情况，这个时候就是我们大名鼎鼎的diff算法大展身手的地盘了。内容很多，我们一点点来看。

#### 开头

```typescript
  const patchKeyedChildren = (
    c1: VNode[],
    c2: VNodeArrayChildren,
    container: RendererElement,
    parentAnchor: RendererNode | null,
    parentComponent: ComponentInternalInstance | null,
    parentSuspense: SuspenseBoundary | null,
    isSVG: boolean,
    slotScopeIds: string[] | null,
    optimized: boolean
) => {
    let i = 0
    const l2 = c2.length
    let e1 = c1.length - 1 // prev ending index
    let e2 = l2 - 1 // next ending index
}
```

首先是初始化一些变量，i是一个索引，l2是新节点的长度，e1是旧节点的长度减1，e2是新节点的长度减1。

#### 前序算法

还是看图，图种，有key的情况下，会先进行一个先序对比，怎么比呢。我们看代码：

```typescript
    // 1. sync from start
    // (a b) c
    // (a b) d e
while (i <= e1 && i <= e2) {
    const n1 = c1[i]
    const n2 = (c2[i] = optimized
        ? cloneIfMounted(c2[i] as VNode)
        : normalizeVNode(c2[i]))
    if (isSameVNodeType(n1, n2)) {
        patch(
            n1,
            n2,
            container,
            null,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
        )
    } else {
        break
    }
    i++
}
``` 

```typescript
export function isSameVNodeType(n1: VNode, n2: VNode): boolean {
    if (
        __DEV__ &&
        n2.shapeFlag & ShapeFlags.COMPONENT &&
        hmrDirtyComponents.has(n2.type as ConcreteComponent)
    ) {
        // #7042, ensure the vnode being unmounted during HMR
        // bitwise operations to remove keep alive flags
        n1.shapeFlag &= ~ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE
        n2.shapeFlag &= ~ShapeFlags.COMPONENT_KEPT_ALIVE
        // HMR only: if the component has been hot-updated, force a reload.
        return false
    }
    return n1.type === n2.type && n1.key === n2.key
}
```

在判断了新旧节点的type和类型相同的情况下，会调用patch函数去使用新节点替换旧节点。

#### 后序算法

```typescript
    // 2. sync from end
    // a (b c)
    // d e (b c)
while (i <= e1 && i <= e2) {
    const n1 = c1[e1]
    const n2 = (c2[e2] = optimized
        ? cloneIfMounted(c2[e2] as VNode)
        : normalizeVNode(c2[e2]))
    if (isSameVNodeType(n1, n2)) {
        patch(
            n1,
            n2,
            container,
            null,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
        )
    } else {
        break
    }
    e1--
    e2--
}
```

与前序算法是一模一样的，只不过从后往前开始比较。这两部分呢还是比较简单的。

#### 插入、新增

```typescript
//新增
// 3. common sequence + mount
// (a b)
// (a b) c
// i = 2, e1 = 1, e2 = 2
// (a b)
// c (a b)
// i = 0, e1 = -1, e2 = 0
if (i > e1) { //如果当前索引大于旧节点的长度
    if (i <= e2) { //并且小于新节点的长度 通过这两个条件可以判断为新增，因为前序和后续已经都对比过了
        const nextPos = e2 + 1
        const anchor = nextPos < l2 ? (c2[nextPos] as VNode).el : parentAnchor
        while (i <= e2) {
            patch(
                null,
                (c2[i] = optimized
                    ? cloneIfMounted(c2[i] as VNode)
                    : normalizeVNode(c2[i])),
                container,
                anchor,
                parentComponent,
                parentSuspense,
                isSVG,
                slotScopeIds,
                optimized
            )
            i++
        }
    }
}
```

patch方法不传入旧节点则是新增。optimized的作用则是为了提升性能，如果是true则会复用节点，否则会重新创建一个新的节点。

#### 卸载、删除

```typescript
//删除
// 4. common sequence + unmount
// (a b) c
// (a b)
// i = 2, e1 = 2, e2 = 1
// a (b c)
// (b c)
// i = 0, e1 = 0, e2 = -1
else
if (i > e2) { //如果当前索引大于新节点的长度
    while (i <= e1) { //当前索引小于旧节点的长度 说明在旧节点而不在新节点
        unmount(c1[i], parentComponent, parentSuspense, true)
        i++
    }
}
```

unmount接收父节点，父级的异步组件收集者。该函数会清除在组件内收集的依赖和副作用函数。

#### 乱序

ok，重头戏来了，在我们进行了先序，后续，新增删除等简单的判断后，剩下的是不是只有一种情况-被移动了，或是删除时移动，或是新增时移动，或是简单的移动。
总之呢，这个新节点的顺序，他就与旧节点的key顺序对不上。

```typescript
const s1 = i // prev starting index
const s2 = i // next starting index

//构建新节点的映射关系

// 5.1 build key:index map for newChildren
const keyToNewIndexMap: Map<string | number | symbol, number> = new Map()
for (i = s2; i <= e2; i++) {
    const nextChild = (c2[i] = optimized
        ? cloneIfMounted(c2[i] as VNode)
        : normalizeVNode(c2[i]))
    if (nextChild.key != null) {
        if (__DEV__ && keyToNewIndexMap.has(nextChild.key)) {
            warn(
                `Duplicate keys found during update:`,
                JSON.stringify(nextChild.key),
                `Make sure keys are unique.`
            )
        }
        keyToNewIndexMap.set(nextChild.key, i)
    }
}
```

这段代码被官方注释为5.1，他是diff的第一步，构建新节点的映射关系，这个映射关系是一个map，key是新节点的key，value是新节点的索引。
比如，现在有如下节点 1、2、3、4、5，进行上面的排序后，会变成一个map ： 5:0, 4:1, 3:2, 2:3, 1:4
ok,接下来是5.2

```typescript
let j
let patched = 0
const toBePatched = e2 - s2 + 1
let moved = false
// used to track whether any node has moved
let maxNewIndexSoFar = 0
// works as Map<newIndex, oldIndex>
// Note that oldIndex is offset by +1
// and oldIndex = 0 is a special value indicating the new node has
// no corresponding old node.
// used for determining longest stable subsequence

//记录新节点在旧节点的位置
const newIndexToOldIndexMap = new Array(toBePatched)
for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0

for (i = s1; i <= e1; i++) {
    const prevChild = c1[i]
    if (patched >= toBePatched) {
        //有多余的节点就删除了
        // all new children have been patched so this can only be a removal
        unmount(prevChild, parentComponent, parentSuspense, true)
        continue
    }
    let newIndex
    if (prevChild.key != null) {
        newIndex = keyToNewIndexMap.get(prevChild.key)
    } else {
        // key-less node, try to locate a key-less node of the same type
        for (j = s2; j <= e2; j++) {
            if (
                newIndexToOldIndexMap[j - s2] === 0 &&
                isSameVNodeType(prevChild, c2[j] as VNode)
            ) {
                newIndex = j
                break
            }
        }
    }
    //如果新节点不包含旧节点也删除
    if (newIndex === undefined) {
        unmount(prevChild, parentComponent, parentSuspense, true)
    } else {
        newIndexToOldIndexMap[newIndex - s2] = i + 1
        if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex
        } else {
            //当节点存在交叉时，需要求最长递增 子序列
            moved = true
        }
        patch(
            prevChild,
            c2[newIndex] as VNode,
            container,
            null,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
        )
        patched++
    }
}
```
5.2相当长啊，但是总体来说，它是执行一个删除操作。首先，我们会遍历旧节点，如果旧节点的key在新节点中不存在，则删除。如果存在，则进行patch操作。
当newIndex < maxNewIndexSoFar时，则需要计算最长递增子序列，这个是为了解决节点交叉的问题。

最后我们再来看一下vue3是怎么求的。
```typescript
function getSequence(arr: number[]): number[] {
  const p = arr.slice()
  const result = [0]
  let i, j, u, v, c
  const len = arr.length
  for (i = 0; i < len; i++) {
    const arrI = arr[i]
    if (arrI !== 0) {
      j = result[result.length - 1]
      if (arr[j] < arrI) {
        p[i] = j
        result.push(i)
        continue
      }
      u = 0
      v = result.length - 1
      while (u < v) {
        c = (u + v) >> 1
        if (arr[result[c]] < arrI) {
          u = c + 1
        } else {
          v = c
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p[i] = result[u - 1]
        }
        result[u] = i
      }
    }
  }
  u = result.length
  v = result[u - 1]
  while (u-- > 0) {
    result[u] = v
    v = p[v]
  }
  return result
}
```
总体来说呢是一个贪心加二分查找的算法，我们可以给几个简化版本来看：
```typescript
let arr = [3,1,5,7,3,1,2,7,8,9]

/**第一重种实现，仅能得到最长递增子序列的长度
 * 时间复杂度O(n^2)
 * 空间复杂度O(n) 使用了一个dp数组
 * @param arr
 */
function diff (arr:number[]) {
    let dp = new Array(arr.length).fill(1)
    for (let i = 1; i < arr.length; i++) { // 从第二个数开始
        for (let j = 0; j < i; j++) { // 从第一个数开始
            if (arr[i] > arr[j]) { // 如果当前数大于前面的数
                dp[i] = Math.max(dp[i], dp[j] + 1) // 当前数的最长递增子序列为前面的数的最长递增子序列+1
            }
        }
    }
    console.log(dp)
    console.log(Math.max(...dp))
}

diff(arr)

/**第二重种实现，得到最长递增子序列的值
 * 时间复杂度O(n^2)
 * 空间复杂度O(n^2) 使用了一个dp二维数组
 * @param arr
 */
function diffWithValue (arr:number[]) {
    let dp = [[arr[0]]] // 以第一个数为结尾的最长递增子序列

    for (let i = 1; i < arr.length; i++) {
        _diff(arr[i])
    }
    function _diff(num:number){ // 计算以num为结尾的最长递增子序列
        for (let i = dp.length - 1; i >= 0; i--) {
            const line = dp[i]
            const tail = line[line.length - 1]
            if (num > tail) { // 如果num大于当前行的最后一个数
                dp.push([...line, num])
                break;
            }
            if(num < tail && i === 0){ // 如果num小于当前行的最后一个数，并且是第一行
                dp[i] = [num]
            }
        }
    }
    return dp[dp.length - 1]
}

console.log(diffWithValue(arr));

function lengthOfLIS(nums: number[]): number {
    const tails: number[] = []; // tails数组用于存储递增子序列的尾部元素

    for (const num of nums) {
        let left = 0;
        let right = tails.length;

        // 使用二分查找在tails数组中找到第一个大于等于当前元素的位置
        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            if (tails[mid] < num) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }

        // 如果当前元素大于tails数组中的最大值，则将其添加到tails数组的末尾
        if (right === tails.length) {
            tails.push(num);
        } else {
            tails[right] = num;
        }
    }

    return tails.length; // 返回tails数组的长度作为最长递增子序列的长度
}


console.log(lengthOfLIS(arr));
```