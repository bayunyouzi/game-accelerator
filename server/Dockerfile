FROM alpine:latest

# 安装sing-box
RUN apk add --no-cache sing-box

# 创建配置目录
RUN mkdir -p /etc/sing-box

# 复制配置文件
COPY config.json /etc/sing-box/config.json

# 暴露端口
EXPOSE 7890

# 启动sing-box
CMD ["sing-box", "run", "-c", "/etc/sing-box/config.json"]
