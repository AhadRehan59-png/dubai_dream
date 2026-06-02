# Run this script as Administrator (right-click -> Run with PowerShell as Admin)
$cfgPath = "C:\Program Files\MongoDB\Server\7.0\bin\mongod.cfg"

if (-not (Test-Path $cfgPath)) {
  Write-Host "MongoDB config not found at $cfgPath"
  exit 1
}

$content = Get-Content $cfgPath -Raw
if ($content -notmatch 'replSetName:\s*rs0') {
  if ($content -match '#replication:') {
    $content = $content -replace '#replication:', "replication:`r`n  replSetName: rs0`r`n`r`n#replication:"
  } else {
    $content += "`r`nreplication:`r`n  replSetName: rs0`r`n"
  }
  Set-Content -Path $cfgPath -Value $content -Encoding UTF8
  Write-Host "Added replica set rs0 to mongod.cfg"
} else {
  Write-Host "Replica set already configured"
}

Restart-Service MongoDB -Force
Start-Sleep -Seconds 4
Write-Host "MongoDB service restarted"

$projectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $projectRoot
node scripts/init-replica-set.mjs

Write-Host ""
Write-Host "Done! Now run:"
Write-Host "  npm run db:push"
Write-Host "  npm run db:seed"
Write-Host "  npm run dev"
Write-Host ""
Write-Host "MongoDB Compass: mongodb://127.0.0.1:27017 -> database dream_dubai"
