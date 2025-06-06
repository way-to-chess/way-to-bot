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
TAG="${COMMIT_HASH}"

check_docker() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed"
        exit 1

    if ! docker info &> /dev/null; then
        log_error "Docker engine is not running"
        exit 1
}


build_and_push() {
    local start_time=$(date +%s)

    log_info "Starting build process for commit: ${COMMIT_HASH}"

    log_info "Building Docker image..."
    if ! docker build -t "${IMAGE_NAME}:${TAG}" .; then
        log_error "Docker build failed"
        exit 1
    fi

    log_info "Tagging as latest..."
    docker tag "${IMAGE_NAME}:${TAG}" "${IMAGE_NAME}:latest"

    log_info "Pushing image to Docker Hub..."
    if ! docker push "${IMAGE_NAME}:${TAG}"; then
        log_error "Failed to push image to Docker Hub"
        exit 1
    fi

    log_info "Pushing latest tag..."
    if ! docker push "${IMAGE_NAME}:latest"; then
        log_error "Failed to push latest tag to Docker Hub"
        exit 1
    fi

    local end_time=$(date +%s)
    local duration=$((end_time - start_time))

    log_info "Build and push completed successfully in ${duration} seconds"
}

main() {
    log_info "Starting docker build script"
    check_docker
    build_and_push
}

main