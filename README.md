# 网游加速器

一款简单易用的网游加速器，首期支持APEX游戏加速。

## 功能特性

- 一键启动，自动配置
- 智能游戏进程识别
- 实时延迟监控
- 流量统计显示
- 简洁友好的用户界面

## 技术栈

### 服务器端
- Alpine Linux
- sing-box
- Docker
- Zeabur

### 客户端
- Tauri 1.x
- React 18
- TypeScript
- Ant Design
- Zustand

## 快速开始

### 服务器部署

1. 克隆项目
```bash
git clone https://github.com/your-username/game-accelerator.git
cd game-accelerator
```

2. 使用Zeabur一键部署
   - 将项目推送到GitHub
   - 在Zeabur中导入项目
   - 配置环境变量：
     - `SERVER_IP=43.128.8.167`
     - `SERVER_PORT=7890`

### 客户端使用

1. 下载客户端安装包
2. 安装并运行客户端
3. 点击"一键启动"按钮
4. 启动APEX游戏即可享受加速服务

## 项目结构

```
game-accelerator/
├── server/              # 服务器端代码
│   ├── Dockerfile      # Docker镜像构建文件
│   └── config.json     # sing-box配置文件
├── client/              # 客户端代码
│   ├── src/            # 源代码
│   │   ├── components/ # React组件
│   │   ├── services/   # 服务层
│   │   ├── store/      # 状态管理
│   │   └── App.tsx     # 主应用
│   ├── package.json    # 依赖配置
│   └── tauri.conf.json # Tauri配置
├── docs/                # 文档
│   ├── deployment.md   # 部署文档
│   └── user-guide.md   # 用户指南
└── .github/             # GitHub配置
    └── workflows/      # CI/CD工作流
```

## 配置说明

### 服务器配置

服务器默认配置：
- IP: 43.128.8.167
- 端口: 7890
- 协议: TCP/UDP

### 客户端配置

客户端会自动配置：
- 系统代理
- 游戏路由规则
- 进程监控

## 开发指南

### 服务器开发

```bash
cd server
docker build -t game-accelerator .
docker run -p 7890:7890 game-accelerator
```

### 客户端开发

```bash
cd client
npm install
npm run tauri dev
```

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request！

## 联系方式

如有问题，请提交Issue或联系开发者。
