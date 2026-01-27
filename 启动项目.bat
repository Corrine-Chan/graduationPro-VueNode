@echo off
chcp 65001 >nul
title 绿闪桩能源管理平台

echo ========================================
echo 绿闪桩能源管理平台 - 启动脚本
echo ========================================
echo.

echo 📝 提示：
echo 1. 请确保已安装 Node.js 和 MySQL
echo 2. 请确保已初始化数据库
echo 2. 请确保已配置 backend/.env 文件
echo.

set /p choice=请选择操作 (1-启动后端 / 2-启动前端 / 3-同时启动): 

if "%choice%"=="1" goto start_backend
if "%choice%"=="2" goto start_frontend
if "%choice%"=="3" goto start_both
goto invalid

:start_backend
echo.
echo 🚀 正在启动后端服务...
cd backend
call npm run dev
goto end

:start_frontend
echo.
echo 🚀 正在启动前端服务...
cd frontend
call npm run dev
goto end

:start_both
echo.
echo 🚀 正在同时启动前后端服务...
echo.
echo 后端服务将在新窗口中启动...
start "后端服务 - Port 3000" cmd /k "cd backend && npm run dev"
timeout /t 3 >nul
echo.
echo 前端服务启动中...
cd frontend
call npm run dev
goto end

:invalid
echo.
echo ❌ 无效的选择！
pause
goto end

:end
