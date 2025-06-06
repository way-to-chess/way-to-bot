#!/bin/bash

# Logs colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN} [INFO] ${NC} $1"
}

log_warn() {
    echo -e "${YELLOW} [WARN] ${NC} $1"
}

log_error() {
    echo -e "${RED} [ERROR] ${NC} $1"
}

set -e

error_handler() {
    local line_number=$1
    local error_code=$2
    log_error "Failed at line ${line_number}: error code ${error_code}"
    exit 1
}

trap 'error_handler ${LINENO} $?' ERR

if [ $# -ne 1 ]; then
    log_error "Usage: $0 <commit-hash>"
    exit 1
fi

COMMIT_HASH=$1
IMAGE_NAME="traktirwik/way_to_bot"
SERVER_TAG="server_${COMMIT_HASH}"
WEB_TAG="web_${COMMIT_HASH}"
PLATFORMS="linux/amd64,linux/arm64"

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

setup_buildx() {
    log_info "Setting up Docker Buildx..."
    if ! docker buildx inspect multiarch > /dev/null 2>&1; then
        docker buildx create --name multiarch --driver docker-container --use
    else
        docker buildx use multiarch
    fi
}

build_images() {
    log_info "Starting build process for commit: ${COMMIT_HASH}"
    
    # Build server image
    log_info "Building server image..."
    if ! docker buildx build --platform ${PLATFORMS} \
        --target server \
        -t "${IMAGE_NAME}:${SERVER_TAG}" \
        --load .; then
        log_error "Server image build failed"
        return 1
    fi
    log_info "Server image built successfully"

    # Build web image
    log_info "Building web image..."
    if ! docker buildx build --platform ${PLATFORMS} \
        --target web \
        -t "${IMAGE_NAME}:${WEB_TAG}" \
        --load .; then
        log_error "Web image build failed"
        return 1
    fi
    log_info "Web image built successfully"

    return 0
}

push_images() {
    log_info "Starting push process..."

    # Push server image
    log_info "Pushing server image to Docker Hub..."
    if ! docker push "${IMAGE_NAME}:${SERVER_TAG}"; then
        log_error "Failed to push server image"
        return 1
    fi
    log_info "Server image pushed successfully"

    # Push web image
    log_info "Pushing web image to Docker Hub..."
    if ! docker push "${IMAGE_NAME}:${WEB_TAG}"; then
        log_error "Failed to push web image"
        return 1
    fi
    log_info "Web image pushed successfully"

    return 0
}

main() {
    local start_time=$(date +%s)
    
    log_info "Starting docker build and push process"
    check_docker
    setup_buildx

    log_info "Building images..."
    if ! build_images; then
        log_error "Build stage failed"
        exit 1
    fi
    log_info "All images built successfully"

    log_info "Pushing images..."
    if ! push_images; then
        log_error "Push stage failed"
        exit 1
    fi
    log_info "All images pushed successfully"

    local end_time=$(date +%s)
    local duration=$((end_time - start_time))

    log_info "Process completed successfully in ${duration} seconds"
    log_info "Server image: ${IMAGE_NAME}:${SERVER_TAG}"
    log_info "Web image: ${IMAGE_NAME}:${WEB_TAG}"
    log_info "Platforms: ${PLATFORMS}"
}

main