---
title: 从零开始的python热力图绘制教程
icon: python
---

教我家大宝怎么用python绘制热力图
<!--more-->
完事开头难，先准备环境和工具
## 在windows安装python
同时按住 **window + r** 键，输入 **cmd**，或者直接搜索cmd，打开如下界面： 

![cmd界面](/carefree/python/hotmap/cmd.jpg)

输入命令如下： 
```cmd
python --version
```
如果能够正确显示python版本，则无需进行下一步。如果不能，请接着操作。

1. 前往[python](https://www.python.org/downloads/)官网下载.
2. 按照流程安装，c盘即可.
3. 配置path环境变量，文件管理器-我的电脑-右键点击-属性-环境变量-系统变量-path-编辑(一般都用不着)

## 安装vscode代码编辑器
[官网](https://vscode.github.net.cn/)下载安装，切记不要安装在c盘，安装好后打开，有如下界面，按照图中箭头操作： 

![打开插件管理](/carefree/python/hotmap/vscode1.png)

![安装python插件](/carefree/python/hotmap/vscode2.png)

## 准备文件夹和文件
1. 找一个地方新建文件夹，命名随意，假设它叫做**hotmap**，将数据表格比如**yMGL-vs-yMGL_Met.pheatmap.order.xlsx**等拷贝过来
2. 使用vscode打开这个文件，如下图： 

![vscode打开文件夹](/carefree/python/hotmap/vscode3.png)

3. 新建文件**datas.py**: 

![新建文件](/carefree/python/hotmap/vscode4.png)

4. 同上，新建文件do.py

现在，你的**hotmap**文件夹下将有至少两个文件 datas.py以及do.py。以及拷贝进来的其它.xslx表格文件，形式大概如下： 

![文件列表](/carefree/python/hotmap/vscode5.png)

## 编辑datas.py文件，处理数据
首先需要安装依赖包，请依次在[在windows安装python](#在windows安装python)步骤中打开的cmd界面执行如下命令：
```shell
pip install pandas
pip install seaborn
pip install matplotlib
```
开始编辑代码
```python
import json

# 假设文件名为 "yMGL-vs-yMGL_Met.pheatmap.order.xlsx"，请替换为你的实际文件名
file_name = "yMGL-vs-yMGL_Met.pheatmap.order.xlsx"

# 读取excel文件
df = pd.read_excel(file_name)

# 获取前50行数据 按需修改
df = df.head(50)

# 获取前50行数据的第一列（gene_id）
gene_ids = df['gene_id'].head(50).tolist()

# 将数据保存为JSON文件
json_file_name = "yMGL-vs-yMGL_Met.pheatmap.order_ids.json"
with open(json_file_name, 'w') as json_file:
    json.dump(gene_ids, json_file, indent=4)

# 从第二列开始提取数据，并转换为二维数组
array_2d = df.iloc[:, 1:].values

# 将二维数组转换为列表
array_2d_list = array_2d.tolist()

# 将数据保存为JSON文件
json_file_name = "yMGL-vs-yMGL_Met.pheatmap.order_data.json"
with open(json_file_name, 'w') as json_file:
    json.dump(array_2d_list, json_file, indent=4)

print(f"Data has been saved to {json_file_name}")
```

在vscode中执行datas.py，如下：

![文件列表](/carefree/python/hotmap/vscode6.png)

操作将会在hotmap文件夹中生成两个文件： **yMGL-vs-yMGL_Met.pheatmap.order_ids.json**以及**yMGL-vs-yMGL_Met.pheatmap.order_data.json**
这两个文件就是等会需要用到的内容。 

## 编辑do.py
现在数据已经处理成想要的了，接下来将会使用它们去绘制图像： 

```python
import json //json处理包
import seaborn as sns // 图形处理包
import matplotlib.pyplot as plt // 图形生成包
from palettable.colorbrewer.sequential import Blues_9 //色盘

# 从 JSON 文件中读取数据
with open('yMGL-vs-yMGL_Met.pheatmap.order_data.json', 'r') as file:
    data = json.load(file)

# 从 ID 文件中读取纵坐标
with open('yMGL-vs-yMGL_Met.pheatmap.order_ids.json', 'r') as file:
    ids = json.load(file)

# 将数据转换为 DataFrame
df = pd.DataFrame(data)

# 检查数据维度是否匹配
if len(ids) != df.shape[0]:
    raise ValueError("The number of IDs does not match the number of rows in the data.")

# 设置 DataFrame 的索引为 ID 列表
df.index = ids

# 生成热力图
plt.figure(figsize=(12, 18))
ax = sns.heatmap(df, cmap=Blues_9.mpl_colormap, annot=False, fmt='.1f', xticklabels=['fpkm_yMGL1', 'fpkm_yMGL2', 'fpkm_yMGL3',
  'fpkm_yMGL_Met_3', 'fpkm_yMGL_Met_2', 'fpkm_yMGL_Met_1'], linewidths=0.5, linecolor='lightgrey')
plt.xticks(rotation=45) 
// 其中 cmap 为色盘值，可以选择多种色盘组合
// linewidths为每格的间隔线宽度 linecolor 为颜色


# 设置字体为 Times New Roman
plt.rcParams['font.family'] = 'serif'
plt.rcParams['font.serif'] = ['Times New Roman']
plt.rcParams['axes.unicode_minus'] = False  # 解决负号显示问题

# 设置字体加粗和字号
for label in ax.get_xticklabels() + ax.get_yticklabels():
    label.set_fontsize(12)  # 设置字体大小
    label.set_fontweight('bold')  # 设置字体加粗

plt.savefig('heatmap.png', dpi=300)  # 增加 DPI 值

plt.show()
```

同上运行，运行后即可看到生成的热力图

## 使用色盘进行调色
访问[https://jiffyclub.github.io/palettable/matplotlib/](https://jiffyclub.github.io/palettable/matplotlib/)查看标准色盘，选择一个替换掉[编辑do.py](#编辑dopy)中cmap的值，以下是一个示例：

1. 在网址中找到一个色盘，比如我这里使用科学绘图常见的palettable.matplotlib，则替换代码： 
```python
delete from palettable.colorbrewer.sequential import Blues_9 //色盘
add from from palettable.matplotlib import Magma_9
```

2. 在网址中找到matplotlib中的某个色系，比如Magma_9

点击运行绘制图案： 

![Magma_9](/carefree/python/hotmap/magma_9.png)