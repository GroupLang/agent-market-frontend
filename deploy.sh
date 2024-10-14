#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Move to the directory containing your Terraform configuration
cd cloud

# Initialize Terraform (if not already initialized)
terraform init

# Plan the changes
echo "Planning Terraform changes..."
terraform plan -out=tfplan

# Apply the changes
echo "Applying Terraform changes..."
terraform apply tfplan

# Get the outputs and store them in variables
S3_BUCKET=$(terraform output -raw s3_bucket_name)
WEBSITE_URL=$(terraform output -raw website_url)
DISTRIBUTION_ID=$(terraform output -raw cloudfront_distribution_id)

# Move back to the root directory
cd ..

# Build your React app (adjust this command if your build process is different)
echo "Building React app..."
npm run build

# Upload the built files to S3
echo "Uploading files to S3..."
aws s3 sync build/ s3://$S3_BUCKET

# Invalidate CloudFront cache
echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"

echo "Deployment complete!"
echo "Your website is now available at: $WEBSITE_URL"
