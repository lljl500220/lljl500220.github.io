---
title: 编写构建脚本
icon: edit
---

## build.js
在packages文件夹同级新建一个scripts文件夹，添加一个build.js文件。我们将通过这个文件来读取模块文件，并构建输出。

### 文件读取
由于vue3的核心代码使用分包的形式，分别写在packages/reactivity、packages/runtime-core、packages/shared等文件夹下，我们需要将这些文件读取出来，然后合并到一个文件中。

```javascript
import fs from 'node:fs/promises'; //fs模块用于操作文件
import {existsSync,readfileSync} from 'node:fs'; //判断文件是否存在，读取文件
import path from 'node:path'; //path模块用于操作文件路径
import {creatrequire} from 'node:module'; //require模块用于引入模块
```