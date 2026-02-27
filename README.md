# 📰 RSS Reader - Edge Browser Extension

[![Version](https://img.shields.io/badge/version-1.0.1-blue.svg)](https://github.com/yourusername/rss-reader-extension)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Edge](https://img.shields.io/badge/Edge-Compatible-0078D7.svg)](https://www.microsoft.com/edge)
[![Chrome](https://img.shields.io/badge/Chrome-Compatible-4285F4.svg)](https://www.google.com/chrome)

A clean, elegant RSS reader browser extension for Edge and Chromium-based browsers. Stay updated with your favorite RSS feeds directly from your browser toolbar.

**[English](#english) | [中文](#中文)**

---

<a name="中文"></a>
## 🌟 功能特点

- 📰 **RSS 订阅阅读** - 支持标准 RSS 2.0、RSS 1.0 和 Atom 格式
- ➕ **自定义订阅源** - 用户可以自由添加喜欢的 RSS 源
- 🗑️ **订阅源管理** - 支持删除不需要的订阅源
- 💾 **数据持久化** - 使用 Chrome Storage API 保存订阅配置，支持跨设备同步
- 🎨 **精美界面** - 现代化的 UI 设计，渐变色主题，支持中文日期显示
- ⚡ **轻量高效** - 原生 JavaScript 实现，无第三方依赖
- 🔒 **隐私安全** - 无数据收集，所有数据仅存储在本地浏览器

## 📸 预览

### 主界面
点击扩展图标即可查看订阅内容，支持快速切换不同订阅源。

### 设置页面
点击右上角设置按钮，可以管理你的订阅源列表。

## 🚀 安装方法

### 方法一：开发者模式加载（推荐）

1. 下载或克隆本项目到本地
   ```bash
   git clone https://github.com/yourusername/rss-reader-extension.git
   ```

2. 打开 Edge 浏览器，在地址栏输入 `edge://extensions/`

3. 打开左下角的 **"开发人员模式"** 开关

4. 点击 **"加载解压缩的扩展"** 按钮

5. 选择项目文件夹

6. 安装成功后，浏览器工具栏会出现 RSS Reader 图标 📰

### 方法二：Chrome 浏览器安装

1. 打开 Chrome 浏览器，访问 `chrome://extensions/`

2. 开启右上角的 **"开发者模式"**

3. 点击 **"加载已解压的扩展程序"**

4. 选择项目文件夹

### 方法三：打包安装

1. 在扩展管理页面点击 **"打包扩展"**

2. 扩展根目录选择项目文件夹

3. 生成 `.crx` 文件后拖拽到扩展页面安装

## 📖 使用说明

### 查看 RSS 内容

1. 点击浏览器工具栏的 RSS Reader 图标
2. 从下拉菜单选择要查看的订阅源
3. 点击文章标题即可在新标签页打开原文
4. 点击刷新按钮可重新加载最新内容

### 添加订阅源

1. 点击右上角的 ⚙️ 设置按钮
2. 在"输入RSS地址"框中粘贴 RSS 链接
3. （可选）输入订阅源名称，不填则自动从 URL 提取
4. 点击"添加订阅源"按钮

### 删除订阅源

1. 进入设置页面
2. 点击订阅源右侧的删除按钮
3. 注意：默认订阅源不可删除

## 📁 项目结构

```
rss-reader-extension/
├── manifest.json      # 扩展配置文件 (Manifest V3)
├── popup.html         # 弹出窗口 HTML
├── popup.css          # 样式文件
├── popup.js           # 主要逻辑代码
├── README.md          # 项目说明文档
└── icons/
    ├── icon16.png     # 16x16 图标
    ├── icon48.png     # 48x48 图标
    └── icon128.png    # 128x128 图标
```

## 🛠️ 技术栈

| 技术 | 说明 |
|------|------|
| **Manifest V3** | 最新的浏览器扩展规范 |
| **Chrome Storage API** | 数据持久化存储 |
| **Vanilla JavaScript** | 原生 JS 实现，无第三方依赖 |
| **CSS3** | 现代化样式设计，渐变主题 |
| **DOMParser API** | XML/RSS 解析 |

## 📡 支持的 RSS 格式

| 格式 | 支持状态 |
|------|----------|
| RSS 2.0 | ✅ 完全支持 |
| RSS 1.0 | ✅ 完全支持 |
| Atom | ✅ 完全支持 |

## ❓ 常见问题

<details>
<summary><b>Q: 为什么有些 RSS 源无法加载？</b></summary>

部分网站可能有跨域限制 (CORS) 或需要特殊请求头。扩展已尽力兼容大多数公开的 RSS 源。如果遇到无法加载的情况，可以尝试：
- 确认 RSS 链接是否有效
- 检查是否需要登录访问
- 尝试使用其他 RSS 源
</details>

<details>
<summary><b>Q: 订阅数据会丢失吗？</b></summary>

数据保存在浏览器的同步存储 (Chrome Storage Sync) 中。如果你登录了浏览器账号并开启了同步功能，订阅数据会自动同步到其他设备。
</details>

<details>
<summary><b>Q: 支持哪些浏览器？</b></summary>

本扩展基于 Chromium 开发，支持以下浏览器：
- ✅ Microsoft Edge
- ✅ Google Chrome
- ✅ Brave Browser
- ✅ 其他基于 Chromium 的浏览器
</details>

<details>
<summary><b>Q: 如何获取网站的 RSS 地址？</b></summary>

大多数新闻网站和博客都提供 RSS 订阅功能。你可以：
1. 在网站上寻找 RSS 图标 🔗
2. 查看网页源代码，搜索 `rss` 或 `atom`
3. 常见格式：`/rss.xml`、`/feed`、`/atom.xml`
</details>

## 🔧 开发指南

### 本地开发

1. 克隆项目
   ```bash
   git clone https://github.com/yourusername/rss-reader-extension.git
   cd rss-reader-extension
   ```

2. 在浏览器中加载扩展（参考安装方法）

3. 修改代码后，在扩展管理页面点击刷新按钮即可

### 调试方法

- 右键点击扩展图标，选择"检查弹出内容"可打开开发者工具
- 在 Console 中查看日志输出
- 在 Network 标签页查看网络请求

### 代码规范

- 使用 ES6+ 语法
- 遵循 JavaScript Standard Style
- 保持代码简洁，添加必要注释

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📝 版本历史

### v1.0.1 (Current)
- 🐛 修复 Service Worker 中 DOMParser 不可用的问题
- ♻️ 重构代码架构，移除 background.js
- 🎨 优化代码结构

### v1.0.0
- 🎉 初始版本发布
- ✨ 支持 RSS/Atom 格式解析
- ✨ 支持添加/删除订阅源
- ✨ 默认包含虎嗅网订阅源

## 📄 许可证

本项目基于 [MIT License](LICENSE) 开源。

---

<a name="english"></a>
## 🌟 Features

- 📰 **RSS Feed Reading** - Supports RSS 2.0, RSS 1.0, and Atom formats
- ➕ **Custom Feed Sources** - Add your favorite RSS feeds freely
- 🗑️ **Feed Management** - Delete unwanted feed sources
- 💾 **Data Persistence** - Uses Chrome Storage API, supports cross-device sync
- 🎨 **Beautiful UI** - Modern design with gradient theme
- ⚡ **Lightweight** - Pure vanilla JavaScript, no dependencies
- 🔒 **Privacy First** - No data collection, all data stored locally

## 🚀 Installation

### Developer Mode (Recommended)

1. Download or clone this project
   ```bash
   git clone https://github.com/yourusername/rss-reader-extension.git
   ```

2. Open Edge/Chrome and navigate to `edge://extensions/` or `chrome://extensions/`

3. Enable **"Developer mode"**

4. Click **"Load unpacked"**

5. Select the project folder

## 📁 Project Structure

```
rss-reader-extension/
├── manifest.json      # Extension config (Manifest V3)
├── popup.html         # Popup HTML
├── popup.css          # Styles
├── popup.js           # Main logic
├── README.md          # Documentation
└── icons/             # Extension icons
```

## 🛠️ Tech Stack

- **Manifest V3** - Latest browser extension standard
- **Chrome Storage API** - Data persistence
- **Vanilla JavaScript** - No dependencies
- **CSS3** - Modern styling

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/DaMaoNi">DaMaoNi</a>
</p>

<p align="center">
  If you find this project helpful, please consider giving it a ⭐️!
</p>
