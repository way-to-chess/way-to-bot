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

build_and_push() {
    local start_time=$(date +%s)

    log_info "Starting build process for commit: ${COMMIT_HASH}"

    # Build and push server image
    log_info "Building and pushing server image..."
    if ! docker buildx build --platform ${PLATFORMS} \
        --target server \
        -t "${IMAGE_NAME}:${SERVER_TAG}" \
        --push .; then
        log_error "Server image build and push failed"
        exit 1
    fi

    # Build and push web image
    log_info "Building and pushing web image..."
    if ! docker buildx build --platform ${PLATFORMS} \
        --target web \
        -t "${IMAGE_NAME}:${WEB_TAG}" \
        --push .; then
        log_error "Web image build and push failed"
        exit 1
    fi

    local end_time=$(date +%s)
    local duration=$((end_time - start_time))

    log_info "Build and push completed successfully in ${duration} seconds"
    log_info "Server image: ${IMAGE_NAME}:${SERVER_TAG}"
    log_info "Web image: ${IMAGE_NAME}:${WEB_TAG}"
    log_info "Platforms: ${PLATFORMS}"
}

main() {
    log_info "Starting docker build script"
    check_docker
    setup_buildx
    build_and_push
}

main