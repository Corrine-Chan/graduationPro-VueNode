@echo off
chcp 65001 >nul
echo ========================================
echo 订单数据初始化脚本
echo ========================================
echo.

echo [1/2] 正在生成订单测试数据...
node generateOrderData.js

if %errorlevel% neq 0 (
    echo.
    echo ❌ 订单数据生成失败！
    echo 请检查：
    echo   1. 数据库是否已启动
    echo   2. .env 文件配置是否正确
    echo   3. 是否已执行 database/schema.sql 创建表结构
    pause
    exit /b 1
)

echo.
echo ========================================
echo ✅ 订单数据初始化完成！
echo ========================================
echo.
echo 现在可以启动前后端服务进行测试了
echo.
pause
