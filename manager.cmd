@echo off
setlocal enabledelayedexpansion
chcp 65001 > nul

:: Настройки проекта
set FLASK_APP=wsgi.py
set FLASK_ENV=development
set PYTHONPATH=.

:: Цвета для вывода (если поддерживается)
set RED=[91m
set GREEN=[92m
set YELLOW=[93m
set BLUE=[94m
set RESET=[0m

:main
cls
echo ========================================
echo   Менеджер
echo ========================================
echo.
@REM echo [9]  Запустить Flask-приложение
echo [1]  Запустить сервер
echo [2]  Работа с Базой Данных
echo [0]  Выход
echo.
set /p choice="Выберите действие (0-9): "

if "%choice%"=="1" goto run
if "%choice%"=="2" goto database
if "%choice%"=="0" goto exit

@REM if "%choice%"=="9" goto run

echo Неверный выбор!
pause
goto main

:run
echo.
echo Запуск Flask-приложения...
flask run
goto main

:database
scripts/managers/database_manager.cmd
pause
goto main

:exit
echo Выход...
pause
exit /b 0