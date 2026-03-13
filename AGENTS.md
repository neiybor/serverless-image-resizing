# Serverless Image Resizing

## Project Overview

AWS Lambda function that resizes images on-the-fly. When an S3-hosted image is requested at a specific dimension path (e.g., `path/300x200/image.jpg`), S3 returns a 307 redirect to API Gateway, which invokes the Lambda to resize the original image using Sharp, store the resized version in S3, and redirect back.

## Verification

There are no automated tests. After making changes to `lambda/index.js`, rebuild the deployment package:

```bash
make dist
```

Verify the zip was created:

```bash
ls -la dist/function.zip
```

## Key Locations

- `lambda/index.js` - Lambda handler (resize logic, Sharp image processing)
- `image-resize.yaml` - SAM/CloudFormation template (S3 bucket, Lambda, API Gateway)
- `api-template.yaml` - Swagger API definition template
- `bin/deploy` - Deployment script (packages and deploys via CloudFormation)
- `Dockerfile` - Amazon Linux image with Node.js for building native dependencies
