# dsh-session-view · 会话视图

DeepSeek Harness（DSH）Web 界面里的**「会话」面板**：侧边栏多一个入口，点开就是一屏列出**所有会话及其实时状态**，
点任意一行直接切到那个会话。

> 标准 DSH bundle 插件（`cordis.patch.yml` + client 半区），装完刷新页面即生效。

## 特性

- **侧边栏入口**：注册到 `sidebar.panellist` 插槽（`id: session-view`，`order: 20`），带一个专用的列表图标。
- **主视图面板**：注册到 `main` 插槽（`key: session-view`），一屏列出全部会话。
- **实时状态**：每行前面一个状态圆点 —— **绿色 = 运行中**，其余颜色 = 空闲。
  数据直接取自宿主注入的会话 store（`useSessions`），状态一变面板立即重绘，不用刷新页面。
- **每行显示什么**：会话标题（没有标题时退化成「前 8 位…后 8 位」的短 id）+ 一行状态说明，
  状态说明由以下片段按顺序拼接：
  - `运行中` / `空闲`
  - `· 子代理`（该会话 `origin` 为 `subagent`）
  - `· 空白会话`（会话被标记为 `blank`）
  - `· 更新于 <本地时间>`（有 `updatedAt` 时）
- **一点即开**：点某一行调用 `uiWorkspace.openSession(id)`，直接跳到那个会话。
- **头部信息**：面板标题、一句说明，以及当前会话总数（`{count} 个会话`）。
- **加载 / 空态**：数据未就绪时显示「正在加载会话…」，一个会话都没有时显示「还没有会话」。
- **中英双语**：面板内置 zh/en 字典；插件列表里的名称与简介在 `locale/zh.json` / `locale/en.json`。
- **零后台开销**：宿主侧 `apply()` 是空实现，纯前端渲染，不轮询、不起定时器。

## 安装

```powershell
dsh plugin add github:cypher-yht/dsh-plugins-session-view
```

本地开发用软链（改源码即生效）：

```powershell
dsh plugin add link:D:\path\to\dsh-plugins-session-view
```

> 桌面客户端（Electron）读的是 `desktop` profile，请让桌面端会话里的 `plugin_manager` 安装。

装完**重启宿主**，浏览器 `Ctrl+F5` 硬刷新。

## 目录结构

```text
dsh-plugins-session-view/
├── index.js            # 宿主侧插件（空实现）
├── client.js           # 前端：侧边栏入口 + 会话列表面板
├── cordis.patch.yml    # 挂载声明
├── locale/             # 插件元信息文案（zh / en）
│   ├── en.json
│   └── zh.json
├── icon.svg            # 插件列表图标
└── package.json
```

## 许可证

MIT，见 [LICENSE](LICENSE)。
