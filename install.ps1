# Installs this setup on the current machine. Safe to run again.
#   powershell -ExecutionPolicy Bypass -File .\install.ps1

$ErrorActionPreference = 'Stop'
$repo = $PSScriptRoot
$claudeDir = Join-Path $env:USERPROFILE '.claude'

# 1. Global CLAUDE.md, backing up any version that differs
$target = Join-Path $claudeDir 'CLAUDE.md'
$source = Join-Path $repo 'global\CLAUDE.md'
if ((Test-Path $target) -and ((Get-FileHash $target).Hash -ne (Get-FileHash $source).Hash)) {
    Copy-Item $target "$target.$(Get-Date -Format yyyyMMdd-HHmmss).bak"
}
Copy-Item $source $target -Force
Write-Host 'Global CLAUDE.md installed'

# 2. Plugin marketplace (this repo) and the flowkit plugin
claude plugin marketplace add $repo
claude plugin install flowkit@rafael-setup
Write-Host 'flowkit plugin installed'

# 3. MCP servers at user scope (removed first so re-running updates them)
function Add-Mcp([string]$name, [string[]]$addArgs) {
    claude mcp remove -s user $name 2>$null | Out-Null
    claude mcp add -s user $name @addArgs
}
Add-Mcp 'serena' @('--', "$env:USERPROFILE\.local\bin\serena.exe", 'start-mcp-server', '--context', 'claude-code', '--project-from-cwd')
# roslyn-mcp targets .NET 9; roll forward to the newest installed runtime
Add-Mcp 'roslyn' @('-e', 'DOTNET_ROLL_FORWARD=Major', '--', "$env:USERPROFILE\.dotnet\tools\roslyn-mcp.exe")
Add-Mcp 'context7' @('--transport', 'http', 'https://mcp.context7.com/mcp')
Add-Mcp 'microsoft-learn' @('--transport', 'http', 'https://learn.microsoft.com/api/mcp')
Add-Mcp 'playwright' @('--', 'npx', '-y', '@playwright/mcp@latest')

claude mcp list
