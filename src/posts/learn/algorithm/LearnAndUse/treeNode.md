---
title: 二叉树
icon: tree
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

## 广度优先遍历 bfs
![bfs（图片来自hello算法）](/learn/treeNode/bfs.png)

bfs的核心是基于队列的先入先出思想，先入父节点，先出子节点。
```typescript
function breadthFirstTraversal(root: TreeNode): Array<number> {
    if (root === null) {
        return [];
    }
    //提供一个队列，在js和ts中没有原生队列，使用Array代替
    //队列要初始化塞入一个节点
    const queue: TreeNode[] = [root];
    //提供遍历后的容器
    const results: Array<number> = [];

    //当队列中没有可遍历的内容后结束
    while (queue.length > 0) {
        const node = queue.shift()!; //告诉ts检查器node不该为空
        //每一次都对队列进行头部出栈，由于进队列的顺序是左-右，所以遍历时能够保证逐层推进。
        results.push(node.val);

        //从当前节点的左子树开始
        if (node.left !== null) {
            queue.push(node.left);
        }

        //然后是右子树
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

## 深度优先遍历 dfs
深度优先遍历又分为前序，中序以及后序遍历。思想是“先走到尽头，在回溯继续”的遍历方式。有一点点像回溯算法。