param (
    [Parameter(Mandatory=$true)]
    [string]$ProjectId
)

# 1. Set Project
Write-Host "Setting Google Cloud Project to $ProjectId..."
gcloud config set project $ProjectId

# 2. Build and Deploy Backend to Cloud Run
Write-Host "Deploying FastAPI Backend to Cloud Run..."
gcloud run deploy fifa-backend `
    --source ./backend `
    --region us-central1 `
    --allow-unauthenticated `
    --port 8000 `
    --format="value(status.url)" > backend_url.txt

$BackendUrl = Get-Content backend_url.txt
Write-Host "Backend deployed at: $BackendUrl"

# 3. Update Frontend to point to remote backend URL
# Since Next.js bakes in NEXT_PUBLIC_ variables at build time, we pass it via build-args or env.
Write-Host "Deploying Next.js Frontend to Cloud Run..."
gcloud run deploy fifa-frontend `
    --source ./frontend `
    --region us-central1 `
    --allow-unauthenticated `
    --port 3000 `
    --set-env-vars="NEXT_PUBLIC_API_URL=$BackendUrl/api"

Write-Host "Deployment Complete!"
Write-Host "Backend API: $BackendUrl"
