# 部署文档

## 服务器部署

### 方式一：使用Zeabur一键部署（推荐）

1. **准备GitHub仓库**
   - 将项目代码推送到GitHub
   - 确保仓库包含完整的代码和配置文件

2. **配置Zeabur**
   - 访问 [Zeabur](https://zeabur.com)
   - 使用GitHub账号登录
   - 点击"New Project"创建新项目
   - 选择"Import from GitHub"
   - 选择你的游戏加速器仓库

3. **配置环境变量**
   在Zeabur项目设置中添加以下环境变量：
   ```
   SERVER_IP=43.128.8.167
   SERVER_PORT=7890
   LOG_LEVEL=info
   ```

4. **部署**
   - 点击"Deploy"按钮
   - 等待部署完成（通常2-5分钟）
   - 部署成功后，Zeabur会提供公网访问地址

### 方式二：手动Docker部署

1. **构建Docker镜像**
   ```bash
   cd server
   docker build -t game-accelerator .
   ```

2. **运行容器**
   ```bash
   docker run -d \
     --name game-accelerator \
     -p 7890:7890 \
     -e SERVER_IP=43.128.8.167 \
     -e SERVER_PORT=7890 \
     game-accelerator
   ```

3. **查看日志**
   ```bash
   docker logs -f game-accelerator
   ```

### 方式三：香港服务器直接部署

1. **登录服务器**
   ```bash
   ssh root@43.128.8.167
   ```

2. **安装Docker**
   ```bash
   curl -fsSL https://get.docker.com | sh
   ```

3. **部署服务**
   ```bash
   git clone <your-repo-url>
   cd game-accelerator/server
   docker build -t game-accelerator .
   docker run -d --name game-accelerator -p 7890:7890 game-accelerator
   ```

## 客户端构建

### Windows客户端

1. **安装依赖**
   ```bash
   cd client
   npm install
   ```

2. **开发模式运行**
   ```bash
   npm run tauri dev
   ```

3. **构建发布版本**
   ```bash
   npm run tauri build
   ```

4. **获取安装包**
   - 构建完成后，安装包位于 `client/src-tauri/target/release/bundle/`
   - Windows: `.msi` 或 `.exe` 文件

### macOS客户端

1. **安装依赖**
   ```bash
   cd client
   npm install
   ```

2. **构建发布版本**
   ```bash
   npm run tauri build
   ```

3. **获取安装包**
   - macOS: `.dmg` 文件

## 部署检查清单

### 服务器部署检查

- [ ] Docker镜像构建成功
- [ ] 容器正常运行
- [ ] 端口7890可访问
- [ ] sing-box配置正确
- [ ] 日志无错误信息

### 客户端构建检查

- [ ] 依赖安装完成
- [ ] 开发模式可正常运行
- [ ] 构建无错误
- [ ] 安装包可正常安装
- [ ] 应用启动正常

## 常见问题

### 服务器部署问题

**Q: Docker构建失败**
A: 检查Dockerfile语法，确保sing-box可正常安装

**Q: 容器无法启动**
A: 查看容器日志：`docker logs game-accelerator`

**Q: 端口无法访问**
A: 检查防火墙设置，确保7890端口开放

### 客户端构建问题

**Q: 依赖安装失败**
A: 尝试删除node_modules重新安装：`rm -rf node_modules && npm install`

**Q: 构建失败**
A: 检查Rust工具链是否正确安装

**Q: 应用无法启动**
A: 检查系统代理配置权限

## 性能优化

### 服务器优化

1. **资源限制**
   ```yaml
   resources:
     limits:
       memory: 512Mi
       cpu: 500m
   ```

2. **日志优化**
   - 调整日志级别为info或warn
   - 配置日志轮转

### 客户端优化

1. **打包优化**
   - 启用代码分割
   - 压缩资源文件

2. **运行时优化**
   - 减少不必要的渲染
   - 优化状态更新频率

## 监控与维护

### 服务器监控

1. **性能监控**
   - CPU使用率
   - 内存使用率
   - 网络流量
   - 连接数

2. **日志监控**
   - 访问日志
   - 错误日志
   - 性能日志

### 客户端监控

1. **崩溃报告**
   - 收集崩溃日志
   - 分析崩溃原因

2. **使用统计**
   - 活跃用户数
   - 功能使用情况
   - 性能指标

## 安全建议

### 服务器安全

1. **防火墙配置**
   - 只开放必要端口
   - 限制访问来源

2. **更新维护**
   - 定期更新sing-box
   - 及时修复安全漏洞

### 客户端安全

1. **代码签名**
   - 使用代码签名证书
   - 验证应用完整性

2. **权限管理**
   - 最小权限原则
   - 用户授权提示

## 备份与恢复

### 服务器备份

1. **配置备份**
   ```bash
   docker cp game-accelerator:/etc/sing-box/config.json ./backup/
   ```

2. **日志备份**
   ```bash
   docker cp game-accelerator:/var/log/sing-box/ ./backup/logs/
   ```

### 恢复流程

1. 停止容器
2. 恢复配置文件
3. 重启容器
4. 验证服务正常

## 联系支持

如有部署问题，请：
1. 查看本文档常见问题部分
2. 提交GitHub Issue
3. 联系技术支持
