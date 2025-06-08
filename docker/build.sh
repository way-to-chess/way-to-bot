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

if [ $# -eq 1 ]; then
    COMMIT_HASH=$1
    ENVIRONMENT="dev"
    log_warn "Environment not specified, using default: ${ENVIRONMENT}"
elif [ $# -eq 2 ]; then
    COMMIT_HASH=$1
    ENVIRONMENT=$2
else
    log_error "Usage: $0 <commit-hash> [environment]"
    log_error "Environment should be 'dev' or 'prod', defaults to 'dev' if not specified"
    exit 1
fi

if [ "$ENVIRONMENT" != "dev" ] && [ "$ENVIRONMENT" != "prod" ]; then
    log_error "Environment should be 'dev' or 'prod'"
    exit 1
fi

IMAGE_NAME="traktirwik/way_to_bot"
SERVER_TAG="server_${COMMIT_HASH}_${ENVIRONMENT}"
WEB_TAG="web_${COMMIT_HASH}_${ENVIRONMENT}"
PLATFORM="linux/amd64"
export DOCKER_BUILDKIT=1


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

    log_info "Starting build process for commit: ${COMMIT_HASH} in ${ENVIRONMENT} environment"

    # Build server image
    log_info "Building server image..."
    if ! docker build \
        --platform ${PLATFORM} \
        --target server \
        --build-arg ENV=${ENVIRONMENT} \
        --cache-from=type=registry,ref=traktirwik/way_to_bot:server_cache \
        --cache-to=type=registry,ref=traktirwik/way_to_bot:server_cache,mode=max \
        -t "${IMAGE_NAME}:${SERVER_TAG}" .; then
        log_error "Server image build failed"
        exit 1
    fi
    log_info "Server image built successfully"

    # Build web image
    log_info "Building web image..."
    if ! docker build \
        --platform ${PLATFORM} \
        --target web \
        --build-arg ENV=${ENVIRONMENT} \
        --cache-from=type=registry,ref=traktirwik/way_to_bot:web_cache \
        --cache-to=type=registry,ref=traktirwik/way_to_bot:web_cache,mode=max \
        -t "${IMAGE_NAME}:${WEB_TAG}" .; then
        log_error "Web image build failed"
        exit 1
    fi
    log_info "Web image built successfully"

    # Push images
    log_info "Pushing server image..."
    if ! docker push "${IMAGE_NAME}:${SERVER_TAG}"; then
        log_error "Server image push failed"
        exit 1
    fi
    log_info "Server image pushed successfully"

    log_info "Pushing web image..."
    if ! docker push "${IMAGE_NAME}:${WEB_TAG}"; then
        log_error "Web image push failed"
        exit 1
    fi
    log_info "Web image pushed successfully"

    local end_time=$(date +%s)
    local duration=$((end_time - start_time))

    log_info "Build and push completed successfully in ${duration} seconds"
    log_info "Server image: ${IMAGE_NAME}:${SERVER_TAG}"
    log_info "Web image: ${IMAGE_NAME}:${WEB_TAG}"
    log_info "Platform: ${PLATFORM}"
    log_info "Environment: ${ENVIRONMENT}"
}

cleanup_images() {
    log_info "Starting cleanup of local images..."
    
    # Remove server image
    if docker images "${IMAGE_NAME}:${SERVER_TAG}" --quiet | grep -q .; then
        log_info "Removing server image..."
        if ! docker rmi "${IMAGE_NAME}:${SERVER_TAG}"; then
            log_warn "Failed to remove server image"
        fi
    fi

    # Remove web image
    if docker images "${IMAGE_NAME}:${WEB_TAG}" --quiet | grep -q .; then
        log_info "Removing web image..."
        if ! docker rmi "${IMAGE_NAME}:${WEB_TAG}"; then
            log_warn "Failed to remove web image"
        fi
    fi

    log_info "Cleanup completed"
}

main() {
    log_info "Starting docker build script"
    check_docker
    build_and_push
    cleanup_images
}

main