# Deploy NodeJs App to Google Cloud Run

Deploying a Node.js app to Google Cloud Run involves several steps, but it's a relatively straightforward process. Here's a step-by-step guide to help you deploy your Node.js app to Google Cloud Run using Github Actions

Every time you push to the main branch of your Github repository, Github Actions will build and deploy your app to Google Cloud Run.

## Prerequisites
- Google Cloud Platform account

## Github Workflow

Edit .github/workflows/cloud-run.yml for your needs.

+ actions/checkout@v2: 
  This action checks out your code from Github so that it can be used by other actions in the workflow.
  
+ google-github-actions/auth@v1: 
  This action authenticates the workflow with Google Cloud Platform.
  
+ google-github-actions/setup-gcloud@v1: 
  This action sets up the Google Cloud SDK in the workflow.
  
+ docker/build-push-action@v2: 
  This action builds and pushes a Docker image to Google Container Registry.
  
+ google-github-actions/deploy-cloudrun@v1: 
  This action deploys a Docker image to Google Cloud Run.

```yaml
name: "Deploy to Google Cloud Run"

on:
  push:
    branches:
      - main

env:
  PROJECT_ID: ${{ secrets.PROJECT_ID }}
  SERVICE_NAME: deploy-nodejs-cloud-run
  GOOGLE_SERVICE_ACCOUNT_KEY: ${{ secrets.GOOGLE_SERVICE_ACCOUNT_KEY }}

jobs:
  deploy:
    name: Deploy to Cloud Run
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      # Auth
      - id: 'auth'
        uses: google-github-actions/auth@v1
        with:
          credentials_json: ${{ secrets.GOOGLE_SERVICE_ACCOUNT_KEY }}

      - name: Set up Google Cloud SKD
        uses: google-github-actions/setup-gcloud@v1

      - name: Configure docker for GCP
        run: gcloud auth configure-docker

      - name: Build and push Docker image
        uses: docker/build-push-action@v2
        with:
          context: .
          push: true
          tags: gcr.io/${{ env.PROJECT_ID }}/${{ env.SERVICE_NAME }}:latest
          build-args: |
            HTTP_PORT=8080

      - name: Deploy to Cloud Run
        uses: google-github-actions/deploy-cloudrun@v1
        with:
          image: gcr.io/${{ env.PROJECT_ID }}/${{ env.SERVICE_NAME }}:latest
          service: ${{ env.SERVICE_NAME }}
          region: us-central1
          platform: managed
          allow-unauthenticated: true
          env_vars: |
            FOO=bar
            ZIP=zap
