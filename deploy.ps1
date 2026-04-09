# =============================================================================
#  lbt-web deploy script
#  Usage: ./deploy.ps1
#         ./deploy.ps1 -SkipBuild    # skip build, upload last dist directly
#         ./deploy.ps1 -DryRun       # build only, no upload
# =============================================================================
param(
    [switch]$SkipBuild,
    [switch]$DryRun
)

# ------------------------------------------------------------------------------
#  Config (edit as needed)
# ------------------------------------------------------------------------------
$SERVER_HOST   = "192.168.10.130"
$SERVER_USER   = "root"
$SERVER_PASS   = "lbt@123.com"
$REMOTE_DIR    = "/var/www/lbt-web"
$LOCAL_DIST    = "$PSScriptRoot\dist"
$VERIFY_URL    = "http://$SERVER_HOST/"

# ------------------------------------------------------------------------------
#  Color output helpers
# ------------------------------------------------------------------------------
function Write-Step { param($msg) Write-Host "`n>> $msg" -ForegroundColor Cyan }
function Write-Ok   { param($msg) Write-Host "   [OK] $msg" -ForegroundColor Green }
function Write-Warn { param($msg) Write-Host "   [!!] $msg" -ForegroundColor Yellow }
function Write-Fail { param($msg) Write-Host "   [FAIL] $msg" -ForegroundColor Red; exit 1 }
function Write-Info { param($msg) Write-Host "   ... $msg" -ForegroundColor Gray }

$startTime = Get-Date
Write-Host ""
Write-Host "==========================================" -ForegroundColor DarkCyan
Write-Host "   LBT-WEB Deploy  ->  $SERVER_HOST"       -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor DarkCyan

# ------------------------------------------------------------------------------
#  Step 1: Check Posh-SSH
# ------------------------------------------------------------------------------
Write-Step "Checking dependency: Posh-SSH"
if (-not (Get-Module -ListAvailable -Name Posh-SSH)) {
    Write-Warn "Posh-SSH not found, installing..."
    Install-Module -Name Posh-SSH -Force -Scope CurrentUser -ErrorAction Stop
    Write-Ok "Posh-SSH installed"
} else {
    Write-Ok "Posh-SSH is ready"
}
Import-Module Posh-SSH -ErrorAction Stop

# ------------------------------------------------------------------------------
#  Step 2: Local build
# ------------------------------------------------------------------------------
if (-not $SkipBuild) {
    Write-Step "Building: npm run build"
    Push-Location $PSScriptRoot
    $buildOutput = npm run build 2>&1
    $buildExit   = $LASTEXITCODE
    Pop-Location

    if ($buildExit -ne 0) {
        Write-Host $buildOutput
        Write-Fail "Build failed, check errors above"
    }
    Write-Ok "Build succeeded -> $LOCAL_DIST"
} else {
    Write-Warn "SkipBuild flag set, using existing dist"
}

# Check dist exists
if (-not (Test-Path "$LOCAL_DIST\index.html")) {
    Write-Fail "dist not found or missing index.html, please build first"
}

if ($DryRun) {
    Write-Warn "DryRun mode: build done, skipping upload"
    exit 0
}

# ------------------------------------------------------------------------------
#  Step 3: SSH connection
# ------------------------------------------------------------------------------
Write-Step "Connecting to $SERVER_USER@$SERVER_HOST"
$secPass  = ConvertTo-SecureString $SERVER_PASS -AsPlainText -Force
$cred     = New-Object System.Management.Automation.PSCredential($SERVER_USER, $secPass)
$session  = New-SSHSession -ComputerName $SERVER_HOST -Credential $cred -AcceptKey -ErrorAction Stop
$sid      = $session.SessionId
Write-Ok "SSH connected (SessionId: $sid)"

function Invoke-Remote {
    param([string]$cmd)
    $r = Invoke-SSHCommand -SessionId $sid -Command $cmd
    return $r
}

# ------------------------------------------------------------------------------
#  Step 4: Clean old files & rebuild remote directory structure
# ------------------------------------------------------------------------------
Write-Step "Cleaning old files on server"
Invoke-Remote "rm -rf ${REMOTE_DIR}/* && echo ok" | Out-Null

# Auto-create subdirectories on server matching local dist structure
$subDirs = Get-ChildItem -Path $LOCAL_DIST -Recurse -Directory |
           ForEach-Object { $_.FullName.Replace($LOCAL_DIST, "").Replace("\", "/") }
foreach ($d in $subDirs) {
    Invoke-Remote "mkdir -p ${REMOTE_DIR}${d}" | Out-Null
}
Write-Ok "Remote directory structure ready"

# ------------------------------------------------------------------------------
#  Step 5: Upload all files
# ------------------------------------------------------------------------------
Write-Step "Uploading build artifacts"
$allFiles = Get-ChildItem -Path $LOCAL_DIST -Recurse -File
$total    = $allFiles.Count
$index    = 0

foreach ($file in $allFiles) {
    $index++
    $relPath    = $file.FullName.Replace($LOCAL_DIST, "").Replace("\", "/")
    $remoteDir  = ($REMOTE_DIR + ($relPath | Split-Path -Parent).Replace("\", "/")).Replace("//", "/")
    $sizeMB     = [math]::Round($file.Length / 1MB, 1)
    $label      = if ($sizeMB -ge 1) { "${sizeMB} MB" } else { "$([math]::Round($file.Length/1KB,0)) KB" }

    Write-Info "[$index/$total] $relPath ($label)"
    Set-SCPItem -ComputerName $SERVER_HOST -Credential $cred -AcceptKey `
        -Path $file.FullName -Destination ($remoteDir + "/") -ErrorAction Stop
}
Write-Ok "All $total files uploaded"

# ------------------------------------------------------------------------------
#  Step 6: Set permissions & reload Nginx
# ------------------------------------------------------------------------------
Write-Step "Setting permissions and reloading Nginx"
Invoke-Remote "chown -R www-data:www-data ${REMOTE_DIR}" | Out-Null
Invoke-Remote "chmod -R 755 ${REMOTE_DIR}" | Out-Null
$nginxResult = Invoke-Remote "nginx -t 2>&1 && systemctl reload nginx && echo RELOAD_OK"
if ($nginxResult.Output -match "RELOAD_OK") {
    Write-Ok "Nginx config OK, hot-reloaded (zero downtime)"
} else {
    Write-Warn "Nginx reload output: $($nginxResult.Output)"
}

# ------------------------------------------------------------------------------
#  Step 7: HTTP verification
# ------------------------------------------------------------------------------
Write-Step "HTTP check: $VERIFY_URL"
try {
    $resp = Invoke-WebRequest -Uri $VERIFY_URL -UseBasicParsing -TimeoutSec 10
    if ($resp.StatusCode -eq 200) {
        Write-Ok "HTTP $($resp.StatusCode) - site is responding normally"
        Write-Info "Server: $($resp.Headers['Server'])"
    } else {
        Write-Warn "HTTP $($resp.StatusCode) - please check manually"
    }
} catch {
    Write-Warn "HTTP check failed: $_"
}

# ------------------------------------------------------------------------------
#  Done
# ------------------------------------------------------------------------------
Remove-SSHSession -SessionId $sid | Out-Null
$elapsed = [math]::Round(((Get-Date) - $startTime).TotalSeconds, 1)

Write-Host ""
Write-Host "==========================================" -ForegroundColor DarkGreen
Write-Host "   [DONE] Deploy finished in ${elapsed}s" -ForegroundColor Green
Write-Host "   URL: $VERIFY_URL"                       -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor DarkGreen
Write-Host ""
