@echo off
echo ========================================================
echo   AIVOA Pharma QMS - GitHub Repository Setup Helper
echo ========================================================
echo.

git init
git add .
git commit -m "feat: AI-powered pharmaceutical customer complaint management system with LangGraph and React"

echo.
echo [1] Enter your GitHub Username:
set /p GH_USER="GitHub Username: "

echo.
echo [2] Enter your GitHub Repository Name (e.g. pharma-complaint-ai):
set /p REPO_NAME="Repository Name: "

git branch -M main
git remote remove origin 2>nul
git remote add origin https://github.com/%GH_USER%/%REPO_NAME%.git

echo.
echo Attempting git push...
git push -u origin main

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ----------------------------------------------------
    echo If the push failed because the repo does not exist on GitHub yet:
    echo 1. Go to https://github.com/new and create a repository named: %REPO_NAME%
    echo 2. Then run: git push -u origin main
    echo ----------------------------------------------------
) else (
    echo.
    echo Successfully pushed to https://github.com/%GH_USER%/%REPO_NAME%!
)

pause
