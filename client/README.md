# 客户端说明

## 概述

客户端使用Tauri + React + TypeScript开发，提供简洁友好的用户界面，支持一键启动游戏加速。

## 技术栈

- **框架**: Tauri 1.x
- **UI框架**: React 18
- **语言**: TypeScript
- **UI组件库**: Ant Design
- **状态管理**: Zustand
- **网络请求**: WebSocket

## 项目结构

```
client/
├── src/
│   ├── components/      # React组件
│   │   ├── Header.tsx   # 头部组件
│   │   ├── MainContent.tsx  # 主内容组件
│   │   └── StatusBar.tsx    # 状态栏组件
│   ├── services/        # 服务层
│   │   ├── proxy.ts     # 代理服务
│   │   ├── process.ts   # 进程服务
│   │   └── connection.ts    # 连接服务
│   ├── store/           # 状态管理
│   │   └── connectionStore.ts
│   ├── App.tsx          # 主应用
│   └── App.css          # 样式文件
├── src-tauri/           # Tauri配置
│   └── tauri.conf.json
├── package.json         # 依赖配置
└── vite.config.ts       # Vite配置
```

## 开发指南

### 环境要求

- Node.js 18+
- Rust 1.70+
- Windows 10/11

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run tauri dev
```

### 构建发布版本

```bash
npm run tauri build
```

构建完成后，安装包位于 `src-tauri/target/release/bundle/` 目录。

## 核心功能

### 1. 代理服务 (proxy.ts)

负责系统代理配置和路由规则管理。

**主要功能**:
- 设置/清除系统代理
- 添加/删除路由规则
- 获取代理状态

**使用示例**:
```typescript
const proxyService = ProxyService.getInstance();
await proxyService.setProxy('127.0.0.1', 7890);
await proxyService.clearProxy();
```

### 2. 进程服务 (process.ts)

负责游戏进程检测和监控。

**主要功能**:
- 检测APEX游戏进程
- 获取进程端口
- 监控进程状态

**使用示例**:
```typescript
const processService = ProcessService.getInstance();
const process = await processService.detectGameProcess();
```

### 3. 连接服务 (connection.ts)

负责与服务器建立WebSocket连接。

**主要功能**:
- 建立WebSocket连接
- 心跳检测
- 延迟检测
- 连接管理

**使用示例**:
```typescript
const connectionService = ConnectionService.getInstance();
await connectionService.connect({
  host: '43.128.8.167',
  port: 7890,
  protocol: 'tcp'
});
```

### 4. 状态管理 (connectionStore.ts)

使用Zustand管理应用状态。

**状态字段**:
- status: 连接状态
- latency: 延迟数据
- uploadSpeed: 上传速度
- downloadSpeed: 下载速度
- error: 错误信息

**使用示例**:
```typescript
const { status, latency, setStatus, updateLatency } = useConnectionStore();
```

## UI组件

### Header组件

显示应用标题和图标。

### MainContent组件

主内容区域，包含：
- 一键启动按钮
- 停止加速按钮
- 连接状态显示
- 游戏检测提示

### StatusBar组件

状态栏，显示：
- 连接状态
- 延迟数据
- 上传/下载速度
- 服务器信息

## 配置说明

### tauri.conf.json

Tauri配置文件，主要配置项：

```json
{
  "productName": "游戏加速器",
  "version": "1.0.0",
  "identifier": "com.gameaccelerator.app",
  "app": {
    "windows": [{
      "title": "游戏加速器",
      "width": 1200,
      "height": 800
    }]
  }
}
```

## 开发注意事项

### 权限要求

客户端需要管理员权限才能：
- 修改系统代理设置
- 配置路由规则
- 监控系统进程

建议以管理员身份运行开发环境。

### 调试技巧

1. **查看控制台日志**
   - 开发模式下按F12打开开发者工具
   - 查看Console标签页的日志

2. **查看Tauri日志**
   - 日志文件位于 `%APPDATA%/game-accelerator/logs/`
   - 查看错误和警告信息

3. **测试网络连接**
   - 使用网络工具测试服务器连接
   - 检查WebSocket连接状态

### 性能优化

1. **减少不必要的渲染**
   - 使用React.memo优化组件
   - 合理使用useCallback和useMemo

2. **优化状态更新**
   - 批量更新状态
   - 避免频繁的状态更新

3. **资源加载优化**
   - 按需加载组件
   - 压缩资源文件

## 常见问题

### Q: 开发模式无法启动
A: 检查Rust工具链是否正确安装，运行 `rustc --version` 验证。

### Q: 构建失败
A: 清理缓存后重新构建：
```bash
rm -rf node_modules src-tauri/target
npm install
npm run tauri build
```

### Q: 系统代理设置失败
A: 以管理员身份运行客户端，检查防火墙设置。

### Q: WebSocket连接失败
A: 检查服务器地址和端口配置，确认服务器正常运行。

## 测试

### 单元测试

```bash
npm run test
```

### E2E测试

```bash
npm run test:e2e
```

## 发布流程

1. 更新版本号
2. 更新CHANGELOG
3. 构建发布版本
4. 测试安装包
5. 发布到GitHub Releases

## 贡献指南

欢迎提交Pull Request！

1. Fork项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

## 许可证

MIT License
