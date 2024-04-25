---
title: 动态规划算法学习
icon: code
isOriginal: true
category: 算法
date: 2024-04-25
tag:
- typeScript
- algorithm
---
okok，鸽了好久的动态规划，它终于来啦！

<!-- more -->

## 什么是动态规划
我愿称之为算法的半壁江山！动态规划是一种解决问题的算法，它的核心思想是将一个大问题分解成一个个小问题，然后将这些小问题的解合并起来，得到大问题的解。  
ok，作为一个程序员，应该容易的能够想到它的思想：
1. 将原问题分解成若干个子问题，这些子问题通常能够更加简单的解决。
2. 自小到大，将这些子问题的解合并起来，得到原问题的解。
3. 记录子问题的解，避免重复计算。

## 动态规划的特点
1. 重叠子问题：动态规划的核心是将一个大问题分解成若干个小问题，这些小问题通常是重叠的，也就是说，这些小问题通常会被重复计算。
2. 最优子结构：动态规划的解通常是由子问题的解合并而来的，也就是说，子问题的解是最优的，那么原问题的解也是最优的。

## 动态规划的实现
接下来我们通过几个例子来说说动态规划如何实现。

### 斐波那契数列 leetCode 509 简单
一道超级经典的题目，斐波那契数列，它的定义如下：  
斐波那契数 （通常用 F(n) 表示）形成的序列称为 斐波那契数列 。该数列由 0 和 1 开始，后面的每一项数字都是前面两项数字的和。也就是：

F(0) = 0，F(1) = 1  
F(n) = F(n - 1) + F(n - 2)，其中 n > 1  
给定 n ，请计算 F(n) 。

按照动态规划的思想，我们可以将这个问题分解成若干个子问题，然后将这些子问题的解合并起来，得到原问题的解。  
1. 将原问题分解成若干个子问题：F(n) = F(n - 1) + F(n - 2)，这里的子问题就是 F(n - 1) 和 F(n - 2)。
2. 自小到大，将这些子问题的解合并起来：我们可以从 0 开始，逐步计算 F(0)、F(1)、F(2)、F(3)、...、F(n)。
3. 记录子问题的解：我们可以使用一个数组来记录 F(0)、F(1)、F(2)、F(3)、...、F(n) 的值，避免重复计算。

```typescript
function fib(n: number): number {
    if (n === 0) return 0
    if (n === 1) return 1
    const dp = new Array(n + 1).fill(0)
    dp[0] = 0
    dp[1] = 1
    for (let i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2]
    }
    return dp[n]
}
```
时间复杂度：O(n)
空间复杂度：O(n)

那有没有更加优化的办法呢？做算法就是要不停的优化嘛，我们可以发现，我们只需要记录 F(n - 1) 和 F(n - 2) 的值，所以我们可以使用两个变量来记录这两个值，而不需要使用一个数组来记录所有的值。

```typescript
function fib(n: number): number {
    if (n === 0) return 0
    if (n === 1) return 1
    let pre = 0
    let cur = 1
    for (let i = 2; i <= n; i++) {
        const sum = pre + cur
        pre = cur
        cur = sum
    }
    return cur
}
```
这样一来，虽然时间复杂度没有变，但是空间复杂度就变成了 O(1)。因为仅使用了常量级别的空间。  

### 爬楼梯 leetCode 70 简单
假设你正在爬楼梯。需要 n 阶你才能到达楼顶。
每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？

这道题目和斐波那契数列有点类似，我们可以将这个问题分解成若干个子问题，然后将这些子问题的解合并起来，得到原问题的解。
1. 将原问题分解成若干个子问题：假设我们要爬到第 n 阶楼梯，那么我们可以从第 n - 1 阶楼梯爬一步，也可以从第 n - 2 阶楼梯爬两步。
2. 自小到大，将这些子问题的解合并起来：我们可以从 0 开始，逐步计算到第 n 阶楼梯。
3. 记录子问题的解：我们可以使用一个数组来记录到达每一阶楼梯的方法数，避免重复计算。

```typescript
function climbStairs(n: number): number {
    if (n === 1) return 1
    if (n === 2) return 2
    const dp = new Array(n + 1).fill(0)
    dp[1] = 1
    dp[2] = 2
    for (let i = 3; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2]
    }
    return dp[n]
}
```
通过这两个简单例子，可以熟悉动态规划的思想和实现。动态规划的核心思想是将一个大问题分解成若干个小问题，然后将这些小问题的解合并起来，得到大问题的解。

ok，接下来我们再看一些比较难的动态规划问题。  

### 不同路径 leetCode 62 中等
::: center
![不同路径](/learn/algorithm/dp1.png)
:::

按照动态规划的思想，我们可以将这个问题分解成若干个子问题，然后将这些子问题的解合并起来，得到原问题的解。
1. 将原问题分解成若干个子问题：假设我们要到达第 i 行第 j 列的格子，那么我们可以从第 i - 1 行第 j 列的格子向下走一步，也可以从第 i 行第 j - 1 列的格子向右走一步。
2. 自小到大，将这些子问题的解合并起来：我们可以从第 0 行第 0 列开始，逐步计算到第 m - 1 行第 n - 1 列。
3. 记录子问题的解：我们可以使用一个二维数组来记录到达每一个格子的路径数，避免重复计算。

```typescript
function uniquePaths(m: number, n: number): number {
    const dp = new Array(m).fill(0).map(() => new Array(n).fill(0))
    for (let i = 0; i < m; i++) {  //左边第一列和上方第一行仅有一种走法
        dp[i][0] = 1
    }
    for (let j = 0; j < n; j++) {
        dp[0][j] = 1
    }
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            //第m x n格的走法，是第m-1 x n格和第m x n-1格的走法之和，因为仅能从这两格走到第m x n格
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1] 
        }
    }
    return dp[m - 1][n - 1]
}
```
这种方法的时间复杂度是 O(m * n)，空间复杂度是 O(m * n)。我们可以发现，我们只需要记录上一行的值和当前行的值，所以我们可以使用两个一维数组来记录这两行的值，而不需要使用一个二维数组来记录所有的值。

```typescript
function uniquePaths(m: number, n: number): number {
    let pre = new Array(n).fill(1)
    let cur = new Array(n).fill(1)
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            cur[j] = cur[j - 1] + pre[j]
        }
        pre = cur.slice()
    }
    return pre[n - 1]
}
```
还能不能再优化呢？经过观察，完全可以仅使用一个数组就可以办到，先看代码再解释：
```typescript
function uniquePaths(m: number, n: number): number {
   const arr = Array.from({length:n}).fill(1) as number[];
   
   for(let i = 1; i < m; i++) {
   		for(let j = 0; j < n; j++) {
        	arr[j] = j - 1 < 0 ? 1 : arr[j] + arr[j - 1];
        }
   }
   
   return arr[n - 1];
};
```
ok,来解释一下上面的代码，我们可以发现，我们在计算第 i 行的值的时候，只需要用到第 i - 1 行的值，所以我们可以仅使用一个数组来记录这两行的值。
1. 我们首先初始化一个长度为 n 的数组，数组的每个元素都是 1，表示第 0 行的值。
2. 然后我们从第 1 行开始，逐行计算每一行的值。
3. 对于每一行的每一列，我们可以根据上一行的值和当前行的值来计算当前行的值。

这题就这样，最后这种解法我也是提交代码后看到人家的解法，感觉很巧妙，所以分享给大家。  

### 最大正方形 leetCode 221 中等
在一个由 '0' 和 '1' 组成的二维矩阵内，找到只包含 '1' 的最大正方形，并返回其面积。

还是先从动态规划的思想出发，我们可以将这个问题分解成若干个子问题，然后将这些子问题的解合并起来，得到原问题的解。
1. 将原问题分解成若干个子问题：假设我们要计算第 i 行第 j 列的格子，那么我们可以从第 i - 1 行第 j 列的格子向上走一步，也可以从第 i 行第 j - 1 列的格子向左走一步，还可以从第 i - 1 行第 j - 1 列的格子向左上走一步。
2. 自小到大，将这些子问题的解合并起来：我们可以从第 0 行第 0 列开始，逐步计算到第 m - 1 行第 n - 1 列。
3. 记录子问题的解：我们可以使用一个二维数组来记录到达每一个格子的最大正方形的边长，避免重复计算。

::: center
![最大正方形](/learn/algorithm/dp2.png)
:::

```typescript
function maximalSquare(matrix: string[][]): number {
    if (matrix.length === 0 || matrix[0].length === 0) {
        return 0
    }
    const m = matrix.length // 行数
    const n = matrix[0].length // 列数
    const dp = new Array(m).fill(0).map(() => new Array(n).fill(0))
    let maxSide = 0
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (matrix[i][j] === '1') {
                if (i === 0 || j === 0) {
                    dp[i][j] = 1
                } else {
                    // dp[i][j] 表示以第 i 行第 j 列为右下角的正方形的最大边长
                    // 参考上面的图例可得到状态转移方程
                    dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1
                }
                maxSide = Math.max(maxSide, dp[i][j])
            }
        }
    }
    return maxSide * maxSide
}
```
本题的关键在于发现状态转移方程。

再来看个困难的题目，非常有意思的一道题。

### 俄罗斯套娃信封问题 leetCode 354 困难
给定一些标记了宽度和高度的信封，宽度和高度以整数对形式(w, h)出现。当另一个信封的宽度和高度都比这个信封大的时候，这个信封就可以放进另一个信封里，如同俄罗斯套娃一样。  
<font color='red'>注意：不允许旋转信封。</font>

这里说一下如何决定状态转移方程，我们可以先对信封按照宽度进行排序，如果宽度相同，那么按照高度进行降序排序。这样我们就可以保证在计算第 i 个信封的最大套娃数的时候，前面的信封已经计算出来了。

```typescript
function maxEnvelopes(envelopes: number[][]): number {
    if (envelopes.length === 0) {
        return 0
    }
    //举个例子 [[5,4],[6,4],[6,7],[2,3]] 排序后 [[2,3],[5,4],[6,7],[6,4]]
    envelopes.sort((a, b) => { // 按照宽度升序，高度降序排序
        if (a[0] === b[0]) { // 宽度相同，按照高度降序排序
            return b[1] - a[1]
        } else {
            return a[0] - b[0]
        }
    })
    //排序后，很容易得到状态转移方程为 dp[i] = Math.max(dp[i], dp[j] + 1)
    //解释一下这个方程，dp[i] 表示以第 i 个信封为最外层信封的最大套娃数
    const n = envelopes.length
    const dp = new Array(n).fill(1)
    let max = 1
    for (let i = 1; i < n; i++) { //宽度总是从小到大，所以只需要考虑高度
        for (let j = 0; j < i; j++) {
            if (envelopes[i][1] > envelopes[j][1]) { // 高度比前面的大 因为宽度已经从小到大排序了
                dp[i] = Math.max(dp[i], dp[j] + 1)
            }
        }
        max = Math.max(max, dp[i])
    }
    return max
}
```

这个题，当我们固定了w宽度的增长顺序时，h高度的增长顺序就是一个最长递增子序列的问题，在我的一篇笔记中，有对求最长递增子序列的解法，可以[参考一下](../../vue/diff.md)。

好了，终于是把动态规划的坑填完了，算法题目是无穷无尽的，需要掌握的是解题的思路，而不是死记硬背。