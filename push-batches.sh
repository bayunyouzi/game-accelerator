#!/bin/bash

# 分批推送脚本
echo "开始分批推送文件到GitHub..."

# 第一批：基础配置文件
echo "推送第一批：基础配置文件..."
git add .gitignore .github LICENSE README.md CHANGELOG.md zeabur.yaml
git commit -m "第一批：基础配置文件"
git push origin master

# 第二批：服务器端文件
echo "推送第二批：服务器端文件..."
git add server/
git commit -m "第二批：服务器端代码"
git push origin master

# 第三批：客户端核心文件
echo "推送第三批：客户端核心文件..."
git add client/src/ client/src-tauri/
git commit -m "第三批：客户端核心代码"
git push origin master

# 第四批：客户端配置文件
echo "推送第四批：客户端配置文件..."
git add client/package.json client/package-lock.json client/tsconfig.json client/vite.config.ts client/index.html
git commit -m "第四批：客户端配置文件"
git push origin master

# 第五批：文档文件
echo "推送第五批：文档文件..."
git add docs/
git commit -m "第五批：文档"
git push origin master

# 第六批：客户端其他文件
echo "推送第六批：客户端其他文件..."
git add client/public/ client/src-tauri/icons/
git commit -m "第六批：客户端资源文件"
git push origin master

echo "所有文件推送完成！"
