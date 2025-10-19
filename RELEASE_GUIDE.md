# 在GitHub上创建Release并上传exe文件的指南

本指南将帮助您在Common-Area-Calculation-Tool仓库中创建GitHub release并上传exe文件，使用户可以直接下载和使用您的应用程序。

## 前提条件

确保您已经成功构建了应用程序，并且exe文件位于项目的`release`目录中：
```
release/Common Area Calculation Tool 0.0.0.exe
```

## 步骤1：登录GitHub并进入仓库

1. 登录您的GitHub账号
2. 访问 [Common-Area-Calculation-Tool](https://github.com/lanco911/Common-Area-Calculation-Tool) 仓库

## 步骤2：创建新的Release

1. 点击仓库页面上方的 "Code" 标签旁边的下拉菜单
2. 选择 "Releases" 选项
3. 点击 "Create a new release" 或 "Draft a new release" 按钮

## 步骤3：填写Release信息

1. **Tag version**: 输入 `v0.1.0`
2. **Target**: 选择 `main` 分支
3. **Release title**: 输入 `房地产共有面积分摊计算工具 v0.1.0`
4. **Describe this release**: 输入以下内容：

```
## 房地产共有面积分摊计算工具 v0.1.0

这是房地产共有面积分摊计算工具的第一个正式发布版本。

### 新功能
- 完整的数据管理功能（手动输入和Excel导入）
- 多级分摊层级配置和管理
- 精确的分摊计算引擎
- 详细的结果分析和可视化
- 结果导出为Excel文件

### 系统要求
- Windows 10 或更高版本
- 至少 4GB RAM
- 100MB 可用磁盘空间

### 安装说明
1. 下载 `Common Area Calculation Tool 0.0.0.exe` 文件
2. 运行安装程序并按照提示完成安装
3. 从开始菜单启动应用程序

### 使用说明
详细的使用说明请参考本仓库中的文档。

### 已知问题
- 无

### 反馈与支持
如有问题或建议，请在本仓库中提交issue。
```

## 步骤4：上传exe文件

1. 在 "Attach binaries by dropping them here or selecting them" 区域，点击或拖拽文件
2. 选择您本地计算机上的 `Common Area Calculation Tool 0.0.0.exe` 文件
   - 该文件位于项目目录的 `release` 文件夹中
3. 等待文件上传完成

## 步骤5：发布Release

1. 确认所有信息无误后
2. 点击 "Publish release" 按钮

## 完成后的效果

- 用户将可以在Release页面中找到并下载exe文件
- Release页面将显示版本信息和下载链接
- 用户可以直接通过浏览器下载安装文件
- 您可以在项目的README.md中添加下载链接，指向这个release

## 更新README.md（可选）

您可以在README.md中添加下载链接部分，例如：

```markdown
## 下载与安装

### 最新版本: v0.1.0

您可以从 [GitHub Releases](https://github.com/lanco911/Common-Area-Calculation-Tool/releases) 页面下载最新版本的安装文件。

直接下载链接: [Common Area Calculation Tool 0.0.0.exe](https://github.com/lanco911/Common-Area-Calculation-Tool/releases/download/v0.1.0/Common%20Area%20Calculation%20Tool%200.0.0.exe)
```

## 后续版本更新

对于未来的版本更新，您可以：

1. 创建新的tag（如v0.2.0, v1.0.0等）
2. 创建新的release并上传新的exe文件
3. 在release说明中列出新增功能和改进

## 注意事项

- 确保exe文件已经过测试，可以正常运行
- 如果文件较大（超过2GB），可能需要先压缩为zip格式
- 考虑为不同操作系统创建不同的release（如Windows的exe和macOS的dmg）