@echo off
chcp 65001 >nul
echo ========================================
echo 绿闪桩能源管理平台 - 数据库初始化
echo ========================================
echo.

set /p mysql_password=请输入 MySQL root 密码: 

echo.
echo 正在创建数据库和表结构...
mysql -u root -p%mysql_password% < schema.sql

if %errorlevel% neq 0 (
    echo.
    echo ❌ 数据库初始化失败！
    echo 请检查：
    echo 1. MySQL 服务是否启动
    echo 2. root 密码是否正确
    echo 3. 是否有足够的权限
    pause
    exit /b 1
)

echo.
echo ✅ 数据库表结构创建成功！
echo.

set /p init_test=是否导入测试数据？(Y/N): 

if /i "%init_test%"=="Y" (
    echo.
    echo 正在导入测试数据...
    mysql -u root -p%mysql_password% < init-test-data.sql
    
    if %errorlevel% neq 0 (
        echo ❌ 测试数据导入失败！
    ) else (
        echo ✅ 测试数据导入成功！
    )
)

echo.
echo ========================================
echo 初始化完成！
echo.
echo 默认账号信息：
echo 管理员: admin123456 / 123456
echo 测试用户: test123456 / 123456
echo ========================================
echo.
pause
