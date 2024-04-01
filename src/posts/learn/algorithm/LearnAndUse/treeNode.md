---
title: 二叉树
icon: code
isOriginal: true
category: 算法
tag:
- typeScript
- algorithm
---
二叉树
<!-- more -->

## 二叉树
```typescript
//ts实现
class TreeNode {
    val: number;
    left: TreeNode | null;
    right: TreeNode | null;

    constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
        this.val = val === undefined ? 0 : val; // 节点值
        this.left = left === undefined ? null : left; // 左子节点引用
        this.right = right === undefined ? null : right; // 右子节点引用
    }
}

/* 初始化二叉树 */
// 初始化节点
let n1 = new TreeNode(1),
    n2 = new TreeNode(2),
    n3 = new TreeNode(3),
    n4 = new TreeNode(4),
    n5 = new TreeNode(5);
// 构建引用指向（即指针）
n1.left = n2;
n1.right = n3;
n2.left = n4;
n2.right = n5;
```

## 广度优先遍历
![bfs（图片来自hello算法）](/learn/treeNode/bfs.png)

bfs的核心是基于队列的先入先出思想，先入父节点，先出子节点。
```typescript
function breadthFirstTraversal(root: TreeNode): Array<number> {
    if (root === null) {
        return [];
    }
    //提供一个队列，在js和ts中没有原生队列，使用Array代替
    const queue: TreeNode[] = [root];
    //提供遍历后的容器
    const results: Array<number> = [];

    //当队列中没有可遍历的内容后结束
    while (queue.length > 0) {
        const node = queue.shift()!; //告诉ts检查器node不该为空
        results.push(node.val);

        if (node.left !== null) {
            queue.push(node.left);
        }

        if (node.right !== null) {
            queue.push(node.right);
        }
    }
    return results;
}
const results = breadthFirstTraversal(n1);
console.log(results)
//[1,2,3,4,5]
```

:::tip 子节点的位置
通过观察结果和原二叉树，可以得到计算子节点索引的办法  
当得到一个元素和它的索引i时，可以计算出:  
左节点索引:2 * i + 1
右节点索引:2 * i + 2
:::