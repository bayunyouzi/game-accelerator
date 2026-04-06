# 服务器端说明

## 概述

服务器端使用sing-box提供流量转发服务，部署在香港服务器43.128.8.167。

## 技术栈

- Alpine Linux: 轻量级Linux发行版
- sing-box: 通用代理平台
- Docker: 容器化部署

## 配置说明

### config.json

sing-box配置文件，包含以下配置：

- **inbounds**: 入站规则，配置tun接口
- **outbounds**: 出站规则，配置direct转发
- **route**: 路由规则，配置游戏流量路由

### 环境变量

- `SERVER_IP`: 服务器IP地址 (默认: 43.128.8.167)
- `SERVER_PORT`: 服务器端口 (默认: 7890)
- `LOG_LEVEL`: 日志级别 (默认: info)

## 部署方式

### Docker部署

```bash
# 构建镜像
docker build -t game-accelerator .

# 运行容器
docker run -d -p 7890:7890 --name game-accelerator game-accelerator
```

### Zeabur部署

1. 将项目推送到GitHub
2. 在Zeabur中导入项目
3. 配置环境变量
4. 一键部署

## 监控

### 日志查看

```bash
docker logs -f game-accelerator
```

### 性能监控

sing-box会自动记录性能指标，包括：
- CPU使用率
- 内存使用率
- 网络流量
- 连接数

## 安全建议

1. 配置防火墙规则，限制访问来源
2. 使用TLS加密通信
3. 定期更新sing-box版本
4. 监控异常连接

## 故障排除

### 连接失败

1. 检查防火墙设置
2. 检查sing-box配置
3. 查看日志文件

### 性能问题

1. 检查服务器资源使用情况
2. 检查网络带宽
3. 优化配置参数

## 联系方式

如有问题，请提交Issue。
