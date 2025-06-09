# Docker Deployment Documentation

## Quick Start
```bash
# Run from project root
bash docker/build.sh <commit_hash> [environment]
```

### Parameters
- `commit_hash`: Required. The commit hash to build
- `environment`: Optional. Values: `dev` (default) | `prod`

## Prerequisites

### 1. Docker Configuration
Enable BuildKit features in your Docker daemon configuration:
```json
{
  "features": {
    "containerd-snapshotter": true
  }
}
```

### 2. Environment Files
Make sure you have the following environment files:
- `.env` in project root
- `.env.dev` and `.env.prod` in:
  - `webapp/` directory
  - `admin/` directory

### 3. Docker Hub Authentication
Login to Docker Hub before building:
```bash
# Run from project root
bash docker/login.sh
```

## Build Process
The build script will:
1. Build server, webapp, and admin images in parallel using BuildKit
2. Tag images with commit hash and environment
3. Push images to Docker Hub
4. Clean up local images after successful push

## Image Tags Format
- Server: `traktirwik/way_to_bot:server_<commit_hash>_<env>`
- Web: `traktirwik/way_to_bot:web_<commit_hash>_<env>`

## Examples
```bash
# Build for dev environment
bash docker/build.sh abc123

# Build for production
bash docker/build.sh abc123 prod
```

