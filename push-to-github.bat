@echo off
setlocal enabledelayedexpansion
title Pantry Pal - Push to GitHub Helper

echo =================================================================
echo             🥦 PANTRY PAL - GITHUB DEPLOYMENT UTILITY 🥦
echo =================================================================
echo This helper script will guide you through initializing git,
echo committing your code safely, and pushing it to GitHub.
echo.
echo NOTE: Sensitive files (.env, node_modules) will be ignored 
echo automatically using the custom .gitignore we configured.
echo =================================================================
echo.

:: Check if git is installed
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Git was not found in your system's PATH.
    echo Please install Git from https://git-scm.com/ and try again.
    echo.
    pause
    exit /b
)

:: Check if .git repository exists
if not exist .git (
    echo [1/4] Git repository not initialized. Initializing now...
    git init
    echo.
) else (
    echo [1/4] Existing Git repository detected.
    echo.
)

:: Git configuration checks
echo Checking for configured Git User...
git config user.name >nul 2>nul
if %errorlevel% neq 0 (
    echo [WARNING] No Git user.name configured globally or locally.
    set /p "gituser=Enter your Git user name: "
    git config --local user.name "!gituser!"
)

git config user.email >nul 2>nul
if %errorlevel% neq 0 (
    echo [WARNING] No Git user.email configured globally or locally.
    set /p "gitmail=Enter your Git email address: "
    git config --local user.email "!gitmail!"
)
echo.

:: Stage all files
echo [2/4] Staging files for commit...
git add .
echo Files staged successfully.
echo.

:: Commit files
echo [3/4] Creating local commit...
git commit -m "Initial commit: Pantry Pal full-stack application"
echo Local commit created successfully.
echo.

:: Push to remote section
echo [4/4] Remote Repository Linkage
echo.
set /p "setup_remote=Do you want to link a GitHub remote repository now? [Y/N]: "
if /i "%setup_remote%"=="Y" (
    echo.
    echo Paste your GitHub repository URL:
    echo (Example: https://github.com/your-username/pantry-pal.git)
    set /p "github_url=Repository URL: "
    
    :: Remove existing origin if there is one
    git remote remove origin >nul 2>&1
    
    :: Add new origin remote
    echo Linking remote...
    git remote add origin !github_url!
    
    :: Set branch to main
    git branch -M main
    
    echo.
    echo =================================================================
    echo Attempting to push to branch 'main'...
    echo Note: If this is a new repository, you may be prompted by GitHub 
    echo to sign in via your browser.
    echo =================================================================
    git push -u origin main
    
    if %errorlevel% eq 0 (
        echo.
        echo [SUCCESS] Project pushed to GitHub successfully!
        echo Open !github_url! to see your repository live.
    ) else (
        echo.
        echo [INFO] Push command completed. If it failed, please check your
        echo network connection, permissions, or check if the repository is empty.
    )
) else (
    echo.
    echo Skipped remote linkage.
    echo You can push manually later using these commands:
    echo   git remote add origin ^<your-github-repo-url^>
    echo   git branch -M main
    echo   git push -u origin main
)

echo.
echo =================================================================
echo                      🎉 SETUP COMPLETE 🎉
echo =================================================================
echo Tips for your Resume Repository:
echo 1. Add a brief description: "Full-stack Pantry inventory tracker"
echo 2. Add relevant tags: react, nodejs, express, mysql, sequelize
echo 3. Pin the repository on your GitHub profile page!
echo =================================================================
echo.
pause
