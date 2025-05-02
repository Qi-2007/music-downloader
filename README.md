# 🎵 AI 驱动的音乐下载器前端

[![Vite](https://img.shields.io/badge/Vite-3.x-blueviolet)](https://vitejs.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-yellow)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-brightgreen)](https://vuejs.org/)

## 📢 项目声明

**本前端项目的大部分代码是通过人工智能辅助开发生成，主要目的是为了学习和研究 Vite 构建工具在实际项目中的应用。项目仅供个人学习、技术交流和演示，不包含任何商业用途。**

**请您在使用本项目的过程中遵守相关法律法规，不得将本项目用于任何侵犯第三方权益的活动。**

## ✨ 功能介绍

本项目旨在提供一个简单的音乐搜索和下载前端界面，目前实现了以下功能：

* **多平台音乐搜索：** 支持从酷我音乐、酷狗音乐和网易云音乐搜索歌曲。
* **音质选择：** 提供多种音质选项供用户选择（如 128kbps MP3, 320kbps MP3, FLAC）。
* **音乐下载：** 提供下载搜索结果中歌曲的功能。
* **简单的播放控制：** 集成了一个简单的音乐播放器，支持播放列表切换。
* **双击列表播放：** 双击歌曲列表中的歌曲即可开始播放。
* **响应式布局：** 针对不同屏幕尺寸进行了基本的布局适配。

## ⚠️ 版权与免责声明

1.  **学习交流目的：** 本项目完全出于学习和技术交流的目的而创建。开发者不对项目的完整性、准确性、安全性或适用性做任何保证。
2.  **AI 辅助开发：** 请注意，本项目的大部分代码由人工智能模型生成，可能存在不足或不完善之处。
3.  **禁止商业用途：** 严禁将本项目用于任何商业活动或盈利目的。
4.  **用户行为责任：** 用户在使用本项目的过程中产生的一切行为及后果由用户自行承担，开发者不承担任何责任。
5.  **第三方平台版权：**
    * **酷我音乐 (KUWO MUSIC):** “酷我”及相关图形、文字商标归其合法所有者所有。本项目仅通过非官方接口进行数据检索，不拥有其任何版权。
    * **酷狗音乐 (KUGOU MUSIC):** “酷狗”及相关图形、文字商标归其合法所有者所有。本项目仅通过非官方接口进行数据检索，不拥有其任何版权。
    * **网易云音乐 (NETEASE CLOUD MUSIC):** “网易云音乐”及相关图形、文字商标归杭州网易云音乐科技有限公司所有。本项目仅通过非官方接口进行数据检索，不拥有其任何版权。
6.  **侵权联系：** 如果您认为本项目侵犯了您的合法权益，请通过以下邮箱联系我们，我们将尽快处理：
    **邮箱：1435990998@qq.com**

## 🛠️ 技术栈

* **构建工具:** [Vite](https://vitejs.dev/)
* **前端框架:** [Vue.js 3](https://vuejs.org/)
* **编程语言:** [JavaScript (ES6+)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
* **状态管理 (简单):** Vue Composition API (Ref, Reactive)
* **HTTP 请求:** `fetch` API
* **音乐播放器:** APlayer

## 🚀 快速开始

1.  **克隆项目到本地：**

    ```bash
    git clone https://github.com/Qi-2007/music-downloader.git
    cd music-downloader
    ```

2.  **安装依赖：**

    ```bash
    npm install
    # 或者
    yarn install
    # 或者
    pnpm install
    ```

3.  **启动开发服务器：**

    ```bash
    npm run dev
    # 或者
    yarn dev
    # 或者
    pnpm dev
    ```

    启动后，通常会在浏览器中自动打开 `http://localhost:<端口号>`。

## 📦 项目结构

├── index.html
├── package.json
├── README.md
├── src
│   ├── App.vue
│   ├── assets
│   │   └── ... (静态资源)
│   ├── components
│   │   ├── Footer.vue
│   │   ├── Player.vue
│   │   ├── Search.vue
│   │   └── SongList.vue
│   ├── main.js
│   └── style.css
├── vite.config.js
└── ... (其他配置文件)


## 📄 未来展望 (仅为学习)

* 更完善的播放器功能。
* 用户界面优化。
* 错误处理和提示改进。

## 🙏 特别感谢

感谢 [Vite](https://vitejs.dev/) 和 [Vue.js](https://vuejs.org/) 团队提供的优秀工具和框架。
