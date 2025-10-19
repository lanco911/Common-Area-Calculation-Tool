# Common Area Calculation Tool

这是一个桌面应用程序，用于计算房地产项目中的公共区域面积如何分摊到各个内部单元。它支持分层级的复杂分摊逻辑，并提供数据导入、导出和可视化功能。

![Application Screenshot](placeholder.png)


## ✨ 主要功能

- **分层管理**: 支持定义多层级的建筑结构（例如：整个建筑 -> 楼层 -> 单元）。
- **区域管理**: 分别管理公共区域和内部单元的面积数据。
- **数据导入**: 支持从 Excel 文件中批量导入公共区域和内部单元的数据。
- **自动计算**: 根据预设的层次结构和分摊规则，自动计算每个单元应分摊的公共面积。
- **结果可视化**: 通过图表和表格清晰地展示分摊结果。
- **报告导出**: 将详细的分摊结果和最终报告导出为 Excel 文件。

## 🛠️ 技术栈

- **桌面应用框架**: [Electron](https://www.electronjs.org/)
- **前端框架**: [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/)
- **构建工具**: [Vite](https://vitejs.dev/)
- **UI 组件库**: [shadcn/ui](https://ui.shadcn.com/)
- **CSS 方案**: [Tailwind CSS](https://tailwindcss.com/)
- **测试框架**: [Vitest](https://vitest.dev/)
- **代码规范**: ESLint, Prettier

## 📦 下载与安装

### 最新版本: v0.1.0

您可以从 [GitHub Releases](https://github.com/lanco911/Common-Area-Calculation-Tool/releases) 页面下载最新版本的安装文件。

直接下载链接: [Common Area Calculation Tool 0.0.0.exe](https://github.com/lanco911/Common-Area-Calculation-Tool/releases/download/v0.1.0/Common%20Area%20Calculation%20Tool%200.0.0.exe)

### 系统要求

- Windows 10 或更高版本
- 至少 4GB RAM
- 100MB 可用磁盘空间

### 安装说明

1. 下载 `Common Area Calculation Tool 0.0.0.exe` 文件
2. 运行安装程序并按照提示完成安装
3. 从开始菜单启动应用程序

## 🚀 开发环境

请确保您的开发环境中已安装 [Node.js](https://nodejs.org/) (建议版本 18.x 或更高)。

### 1. 克隆仓库

```bash
git clone https://github.com/lanco911/Common-Area-Calculation-Tool.git
cd Common-Area-Calculation-Tool
```

### 2. 安装依赖

```bash
npm install
```

### 3. 运行开发环境

此命令将启动 Vite 开发服务器并打开 Electron 应用窗口，支持热重载。

```bash
npm run electron:dev
```

## 📦 构建应用

执行以下命令来为您的操作系统构建可执行的应用程序。

```bash
npm run electron:dist
```

构建完成后，您可以在 `release` 目录下找到打包好的文件（例如 `.exe` 或 `.dmg`）。

如需创建GitHub release并上传exe文件，请参考 [RELEASE_GUIDE.md](./RELEASE_GUIDE.md) 中的详细说明。

## 🧪 运行测试

使用以下命令来运行项目中所有的单元测试和集成测试。

```bash
npm test
```

## 📂 项目结构

```
.
├── electron/              # Electron 主进程和预加载脚本
│   ├── main.ts
│   └── preload.js
├── release/               # 通过 `electron:dist` 构建的应用输出目录
├── src/                   # React 应用源代码
│   ├── components/        # UI 组件
│   │   ├── ui/            # shadcn/ui 基础组件
│   │   ├── AreaList.tsx   # 区域列表
│   │   └── ...
│   ├── lib/               # 核心业务逻辑
│   │   ├── calculationService.ts # 主要计算服务
│   │   ├── importService.ts      # 导入服务
│   │   └── excelExportService.ts # 导出服务
│   ├── models/            # TypeScript 类型和数据模型
│   ├── RealEstateCalculator.tsx # 主应用组件
│   └── main.tsx           # React 应用入口
├── package.json           # 项目依赖和脚本
└── vite.config.ts         # Vite 配置文件
```

## 🤝 贡献

欢迎提交问题报告 (issues) 和合并请求 (pull requests)。

## 📄 许可证

本项目采用 [MIT](LICENSE) 许可证。