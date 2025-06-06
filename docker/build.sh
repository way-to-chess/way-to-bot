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

build_and_push() {
    local start_time=$(date +%s)

    log_info "Starting build process for commit: ${COMMIT_HASH}"

    # Build server image
    log_info "Building server image..."
    if ! docker build --target server -t "${IMAGE_NAME}:${SERVER_TAG}" .; then
        log_error "Server image build failed"
        exit 1
    fi

    # Build web image
    log_info "Building web image..."
    if ! docker build --target web -t "${IMAGE_NAME}:${WEB_TAG}" .; then
        log_error "Web image build failed"
        exit 1
    fi

    # Push server image
    log_info "Pushing server image to Docker Hub..."
    if ! docker push "${IMAGE_NAME}:${SERVER_TAG}"; then
        log_error "Failed to push server image"
        exit 1
    fi

    # Push web image
    log_info "Pushing web image to Docker Hub..."
    if ! docker push "${IMAGE_NAME}:${WEB_TAG}"; then
        log_error "Failed to push web image"
        exit 1
    fi

    local end_time=$(date +%s)
    local duration=$((end_time - start_time))

    log_info "Build and push completed successfully in ${duration} seconds"
    log_info "Server image: ${IMAGE_NAME}:${SERVER_TAG}"
    log_info "Web image: ${IMAGE_NAME}:${WEB_TAG}"
}

main() {
    log_info "Starting docker build script"
    check_docker
    build_and_push
}

main