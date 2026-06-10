$ErrorActionPreference = 'Stop'

$root = 'C:\Users\user\Downloads\African-Vision-Design-main (2)\African-Vision-Design-main'
$tsx = Join-Path $root 'node_modules\.pnpm\tsx@4.21.0\node_modules\tsx\dist\cli.mjs'

Set-Location $root
$env:PORT = '8080'

node --env-file=.env $tsx 'artifacts/api-server/src/index.ts'
