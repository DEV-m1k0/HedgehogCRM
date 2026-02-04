@echo off
setlocal enabledelayedexpansion
chcp 65001 > nul

:: Настройки проекта
set FLASK_APP=wsgi.py
set FLASK_ENV=development
set PYTHONPATH=.

:main
cls
echo ========================================
echo   Управление БД
echo ========================================
echo.
echo [1]  Инициализировать миграции
echo [2]  Создать миграцию
echo [3]  Применить миграции
echo [4]  Откатить миграцию
echo [5]  Показать историю миграций
echo [6]  Показать текущую миграцию
echo [7]  Заполнить БД тестовыми данными
echo [8]  Пересоздать БД (DANGER!)
echo [0]  Выйти
echo.

set /p choice="Выберите действие (0-9): "

if "%choice%"=="1" goto init
if "%choice%"=="2" goto migrate
if "%choice%"=="3" goto upgrade
if "%choice%"=="4" goto downgrade
if "%choice%"=="5" goto history
if "%choice%"=="6" goto current
if "%choice%"=="7" goto seed
if "%choice%"=="8" goto reset
if "%choice%"=="0" goto exit

:init
echo.
echo Инициализация репозитория миграций...
flask db init
if errorlevel 1 (
    echo Ошибка при инициализации!
) else (
    echo Репозиторий миграций создан успешно!
)
pause
goto main

:migrate
echo.
set /p message="Введите описание миграции: "
if "%message%"=="" set message="update"
echo Создание миграции: %message%
flask db migrate -m "%message%"
if errorlevel 1 (
    echo Ошибка при создании миграции!
) else (
    echo Миграция создана успешно!
)
pause
goto main

:upgrade
echo.
echo Применение миграций...
flask db upgrade
if errorlevel 1 (
    echo Ошибка при применении миграций!
) else (
    echo Миграции применены успешно!
)
pause
goto main

:downgrade
echo.
echo Текущие миграции:
flask db history
echo.
set /p revision="Введите ревизию для отката (или нажмите Enter для отката на 1 шаг): "
if "%revision%"=="" (
    flask db downgrade
) else (
    flask db downgrade %revision%
)
if errorlevel 1 (
    echo Ошибка при откате миграции!
) else (
    echo Откат выполнен успешно!
)
pause
goto main

:history
echo.
echo История миграций:
flask db history
pause
goto main

:current
echo.
echo Текущая миграция:
flask db current
pause
goto main

:seed
echo.
echo Заполнение БД тестовыми данными...
python scripts/database/seed.py
if errorlevel 1 (
    echo Ошибка при заполнении БД!
) else (
    echo БД заполнена тестовыми данными!
)
pause
goto main

:reset
echo.
echo ВНИМАНИЕ!
echo Если выберить 'y', то это приведет к безвозратному удалению всех данных в базе данных!
echo.
set /p confirm="Вы уверены? (y/N): "
if /i "%confirm%"=="y" (
    echo Удаление всех таблиц...
    flask db downgrade base
    echo Применение миграций...
    flask db upgrade
    echo Заполнение тестовыми данными...
    python seed.py
    echo БД пересоздана успешно!
) else (
    echo Операция отменена.
)
pause
goto main

:exit
echo Выход...
manager.cmd