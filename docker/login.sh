#!/bin/bash

# Colors for logging
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# Check if Docker is installed and running
check_docker() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed"
        exit 1
    fi

    if ! docker info &> /dev/null; then
        log_error "Docker engine is not running"
        exit 1
    fi
}

# Load environment variables
load_env() {
    ENV_FILE="${PWD}/.env"
    
    if [ ! -f "$ENV_FILE" ]; then
        log_error ".env file not found in current directory: ${PWD}"
        exit 1
    fi

    log_info "Loading .env from: ${PWD}"

    # Read required variables without exposing all env content
    DOCKER_USER=$(grep -E "^DOCKER_USER=" "$ENV_FILE" | cut -d '=' -f2)
    DOCKER_PAT=$(grep -E "^DOCKER_PAT=" "$ENV_FILE" | cut -d '=' -f2)

    # Check if variables are set
    if [ -z "$DOCKER_USER" ] || [ -z "$DOCKER_PAT" ]; then
        log_error "DOCKER_USER or DOCKER_PAT not found in .env file"
        exit 1
    fi

    log_info "Found credentials for user: $DOCKER_USER"
}

# Perform Docker login
docker_login() {
    log_info "Attempting to login to Docker Hub as $DOCKER_USER"
    
    if echo "$DOCKER_PAT" | docker login -u "$DOCKER_USER" --password-stdin; then
        log_info "Successfully logged in to Docker Hub"
    else
        log_error "Failed to login to Docker Hub"
        exit 1
    fi
}

# Check if already logged in
check_login_status() {
    if docker info 2>&1 | grep -q "Username"; then
        log_warn "Already logged in to Docker Hub. Proceeding with re-login..."
    fi
}

main() {
    check_docker
    load_env
    check_login_status
    docker_login
}

main 