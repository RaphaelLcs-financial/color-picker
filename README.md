# @claw-dev/color-picker
[![npm](https://img.shields.io/npm/v/@raphaellcs/color-picker)](https://www.npmjs.com/package/@raphaellcs/color-picker)
[![downloads](https://img.shields.io/npm/dm/@raphaellcs/color-picker)](https://www.npmjs.com/package/@raphaellcs/color-picker)
[![license](https://img.shields.io/npm/l/@raphaellcs/color-picker)](https://www.npmjs.com/package/@raphaellcs/color-picker)

> 颜色选择工具 - 生成和转换颜色代码

## 🎨 功能

- **HEX 转 RGB**：十六进制颜色转 RGB
- **RGB 转 HEX**：RGB 值转十六进制
- **RGB 转 HSL**：RGB 值转 HSL 色彩空间
- **HSL 转 RGB**：HSL 色彩空间转 RGB
- **生成调色板**：基于主色生成和谐调色板
- **随机颜色**：生成随机颜色
- **颜色预览**：ANSI 颜色块显示

## 📦 安装

```bash
npx @claw-dev/color-picker
```

## 📖 快速开始

### 1. 转换颜色格式

```bash
# HEX 转 RGB/HSL
color-picker convert #ff5733

# 只显示 HSL
color-picker convert #ff5733 --hsl
```

输出：

```
🎨 颜色转换

HEX: #FF5733
RGB: rgb(255, 87, 51)
HSL: hsl(14, 100%, 60%)

 ████████████ 
 ████████████ 
```

### 2. 生成调色板

```bash
# 生成 10 个和谐颜色
color-picker palette #ff5733

# 生成 20 个
color-picker palette #ff5733 --count 20

# 显示颜色预览
color-picker palette #ff5733 --preview
```

### 3. 生成随机颜色

```bash
# 生成 1 个随机颜色
color-picker random

# 生成 5 个随机颜色
color-picker random --count 5

# 显示颜色预览
color-picker random --count 3 --preview
```

## 📋 命令

### convert

转换颜色格式。

```bash
color-picker convert <hex>
```

**选项：**
- `--hsl` - 显示 HSL 格式
- `--no-preview` - 不显示颜色预览块

**输出：**
- HEX 值（大写）
- RGB 值（rgb(r, g, b)）
- HSL 值（hsl(h, s%, l%)）
- ANSI 颜色预览块

### palette

基于主色生成和谐调色板。

```bash
color-picker palette <hex>
```

**选项：**
- `-n, --count <number>` - 颜色数量（默认 10）
- `--preview` - 显示颜色预览块

**调色板生成规则：**
- 保持色相（H）不变
- 调整饱和度（S）：从主色开始，逐渐变化
- 调整亮度（L）：从主色开始，向两端扩展

### random

生成随机颜色。

```bash
color-picker random
```

**选项：**
- `-n, --count <number>` - 生成数量（默认 1）
- `--preview` - 显示颜色预览块

## 🎨 色彩格式

### HEX

十六进制表示法，如 `#FF5733`。

### RGB

红绿蓝三原色表示法，如 `rgb(255, 87, 51)`。

### HSL

色相、饱和度、亮度表示法，如 `hsl(14, 100%, 60%)`。

| 格式 | 说明 | 示例 |
|------|------|------|
| HEX | 网页常用 | `#FF5733` |
| RGB | 图形处理 | `rgb(255, 87, 51)` |
| HSL | 设计、调色 | `hsl(14, 100%, 60%)` |

## 💡 使用场景

### 1. 网页设计

```bash
# 选择主色，生成调色板
color-picker palette #ff5733 --preview
```

获得一组和谐的颜色用于网页设计。

### 2. UI 设计

```bash
# 生成随机的 UI 配色
color-picker random --count 3 --preview
```

快速生成多个配色方案。

### 3. 品牌设计

```bash
# 品牌色转换为所有格式
color-picker convert #ff5733
```

获取品牌色的所有格式表示。

### 4. 开发调试

```bash
# HEX 转 RGB
color-picker convert #ff5733
```

快速转换不同颜色格式用于开发。

## 🎨 颜色预览

当使用 `--preview` 选项时，会显示 ANSI 颜色块：

```
 ████████████ 
 ████████████ 
```

这能让你直观看到颜色的效果。

## 🔧 颜色算法

### HEX 转 RGB

```javascript
hex = hex.replace('#', '');
r = parseInt(hex.substring(0, 2), 16);
g = parseInt(hex.substring(2, 4), 16);
b = parseInt(hex.substring(4, 6), 16);
```

### RGB 转 HSL

```javascript
r /= 255;
g /= 255;
b /= 255;

max = Math.max(r, g, b);
min = Math.min(r, g, b);
l = (max + min) / 2;

if (max === min) {
  h = 0;
} else {
  d = max - min;
  if (max === r) {
    h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  } else if (max === g) {
    h = ((b - r) / d + 2) / 6;
  } else {
    h = ((r - g) / d + 4) / 6;
  }
}

s = l > 0.5 ? (max - min) / (2 - max - min) : 0;
```

### 调色板生成

基于主色的 HSL 值生成：

1. **保持色相（H）不变**
2. **调整饱和度（S）**：从主色开始，逐渐降低
3. **调整亮度（L）**：从主色开始，向两端扩展

## 🚧 待实现

- [ ] 支持更多色彩空间（CMYK、LAB）
- [ ] 颜色对比度计算
- [ ] 颜色和谐规则分析
- [ ] 导出为 CSS 变量
- [ ] 导出为设计资源

## 🤝 贡献

欢迎提交 Issue 和 PR！

## 📄 许可证

MIT © 梦心

---

Made with 🌙 by 梦心
