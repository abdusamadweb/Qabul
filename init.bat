@echo off
set SERVER=31.128.39.74
set USERNAME=root
set PASSWORD=t^54KxAA+Mav
set LOCAL_DIR="C:\Users\user\Documents\Developer\Qabul\my-app"
set REMOTE_DIR=/var/www/sharq.pro-premiums.com/html/
set ARCHIVE_PATH="C:\Users\user\Documents\Developer\Qabul\my-app\dist.tar.gz"


@REM vite build
REM node_modules papkasini chetlab o‘tib arxiv yaratish
tar --exclude=".idea" --exclude=".vscode"  --exclude=".git" --exclude="init.bat"  -czvf %ARCHIVE_PATH% -C "B:\Projects Vue\Sharq-University Qabul\qabul\dist" .


echo Starting SCP upload...

REM SCP orqali arxivni yuklash
scp %ARCHIVE_PATH% %USERNAME%@%SERVER%:%REMOTE_DIR%

echo Files uploaded. Extracting on server and starting project...

REM SSH orqali serverda arxivni ochish va `node index.js` buyrug'ini ishga tushirish
ssh %USERNAME%@%SERVER% "cd %REMOTE_DIR% && tar -xzvf dist.tar.gz && rm dist.tar.gz"
@REM
echo Project started on server.
pause
