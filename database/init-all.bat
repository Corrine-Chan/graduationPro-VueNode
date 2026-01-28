@echo off
chcp 65001 >nul
echo ========================================
echo 数据库完整初始化脚本
echo ========================================
echo.

set /p mysql_password=请输入 MySQL root 密码: 

echo.
echo 📝 步骤 1/3: 创建基础表结构...
mysql -u root -p%mysql_password% < schema.sql
if %errorlevel% neq 0 (
    echo ❌ 基础表结构创建失败！
    pause
    exit /b 1
)
echo ✅ 基础表结构创建成功！

echo.
echo 📝 步骤 2/3: 创建扩展表结构...
mysql -u root -p%mysql_password% < extended-schema.sql
if %errorlevel% neq 0 (
    echo ❌ 扩展表结构创建失败！
    pause
    exit /b 1
)
echo ✅ 扩展表结构创建成功！

echo.
echo 📝 步骤 3/3: 生成测试数据...
mysql -u root -p%mysql_password% < generate-test-data.sql
if %errorlevel% neq 0 (
    echo ❌ 测试数据生成失败！
    pause
    exit /b 1
)
echo ✅ 测试数据生成成功！

echo.
echo ========================================
echo 🎉 数据库初始化完成！
echo ========================================
echo.
echo 📊 数据库信息:
echo - 数据库名: charging_station
echo - 充电站: 10个
echo - 充电桩: 100个
echo - 订单: 50条
echo - 会员: 5个
echo - 告警: 5条
echo.
echo 👤 默认账号:
echo - 管理员: admin123456 / 123456
echo - 测试用户: test123456 / 123456
echo ========================================
echo.
pause
