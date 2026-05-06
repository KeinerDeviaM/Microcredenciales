#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="${1:-}"
REGION="${2:-us-central1}"
SERVICE_NAME="edtech-microcredenciales-backend"
REPOSITORY="edtech-containers"
IMAGE_NAME="microcredenciales-backend"
JWT_SECRET_VALUE="${JWT_SECRET:-$(openssl rand -base64 64)}"

if [ -z "$PROJECT_ID" ]; then
  echo "Uso: ./deploy/gcp-cloud-run.sh TU_PROJECT_ID [REGION]"
  exit 1
fi

echo "Proyecto: $PROJECT_ID"
echo "Región: $REGION"

gcloud config set project "$PROJECT_ID"
gcloud services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com

if ! gcloud artifacts repositories describe "$REPOSITORY" --location="$REGION" >/dev/null 2>&1; then
  gcloud artifacts repositories create "$REPOSITORY" \
    --repository-format=docker \
    --location="$REGION" \
    --description="Imágenes Docker EdTech"
fi

IMAGE_URI="$REGION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY/$IMAGE_NAME:1.0.0"

gcloud builds submit ./backend --tag "$IMAGE_URI"

gcloud run deploy "$SERVICE_NAME" \
  --image "$IMAGE_URI" \
  --platform managed \
  --region "$REGION" \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 2 \
  --set-env-vars "JWT_SECRET=$JWT_SECRET_VALUE,JWT_EXPIRATION_MS=86400000,CORS_ALLOWED_ORIGINS=http://localhost:4200"

SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" --region "$REGION" --format='value(status.url)')
echo "Backend desplegado en: $SERVICE_URL"
echo "API base: $SERVICE_URL/api"
