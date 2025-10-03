# Clean Commit Script for RoyalMatch
# Removes console logs, verifies compilation, checks lint/format, and creates descriptive commit

Write-Host "=== Starting Clean Commit Process ===" -ForegroundColor Cyan

# Step 1: Remove console.log and equivalents
Write-Host "`n[1/6] Removing console logs..." -ForegroundColor Yellow
$files = Get-ChildItem -Recurse -Include *.ts,*.js -Exclude node_modules,dist,build,.angular

$removedCount = 0
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $newContent = $content -replace "console\.(log|debug|info|warn|error)\([^)]*\);?\s*`n?", ""

    if ($content -ne $newContent) {
        Set-Content $file.FullName -Value $newContent -NoNewline
        $removedCount++
    }
}
Write-Host "Removed console logs from $removedCount file(s)" -ForegroundColor Green

# Step 2: Verify compilation - Client
Write-Host "`n[2/6] Verifying client compilation..." -ForegroundColor Yellow
if (Test-Path "client/angular.json") {
    Push-Location client
    $buildResult = npm run build 2>&1
    Pop-Location

    if ($LASTEXITCODE -ne 0) {
        Write-Host "Client compilation failed!" -ForegroundColor Red
        exit 1
    }
    Write-Host "Client compiled successfully" -ForegroundColor Green
} else {
    Write-Host "No Angular client found, skipping" -ForegroundColor Gray
}

# Step 3: Verify compilation - Server
Write-Host "`n[3/6] Verifying server compilation..." -ForegroundColor Yellow
if (Test-Path "server/package.json") {
    Push-Location server
    $buildResult = npm run build 2>&1
    Pop-Location

    if ($LASTEXITCODE -ne 0) {
        Write-Host "Server compilation failed!" -ForegroundColor Red
        exit 1
    }
    Write-Host "Server compiled successfully" -ForegroundColor Green
} else {
    Write-Host "No AdonisJS server found, skipping" -ForegroundColor Gray
}

# Step 4: Check and fix lint
Write-Host "`n[4/6] Checking lint..." -ForegroundColor Yellow
if (Test-Path "client/package.json") {
    Push-Location client
    npm run lint --if-present 2>&1 | Out-Null
    Pop-Location
}
if (Test-Path "server/package.json") {
    Push-Location server
    npm run lint --if-present 2>&1 | Out-Null
    Pop-Location
}
Write-Host "Lint check completed" -ForegroundColor Green

# Step 5: Format code
Write-Host "`n[5/6] Formatting code..." -ForegroundColor Yellow
if (Test-Path "client/package.json") {
    Push-Location client
    npm run format --if-present 2>&1 | Out-Null
    Pop-Location
}
if (Test-Path "server/package.json") {
    Push-Location server
    npm run format --if-present 2>&1 | Out-Null
    Pop-Location
}
Write-Host "Code formatted" -ForegroundColor Green

# Step 6: Stage changes and show status
Write-Host "`n[6/6] Staging changes..." -ForegroundColor Yellow
git add .

Write-Host "`n=== Git Status ===" -ForegroundColor Cyan
git status --short

Write-Host "`n=== Changes Summary ===" -ForegroundColor Cyan
$gitDiff = git diff --cached --stat

if ($gitDiff) {
    Write-Host $gitDiff
    Write-Host "`nReady to commit! Use git commit with a descriptive message." -ForegroundColor Green
    Write-Host "Suggested commit format:" -ForegroundColor Yellow
    Write-Host "  chore: clean code - remove console logs, verify compilation, lint and format" -ForegroundColor Gray
} else {
    Write-Host "No changes to commit" -ForegroundColor Yellow
}
