#!/usr/bin/env sh

# Set default values
ORGANIZATION=${ORGANIZATION:-$(basename "$(realpath ..)")}
REPO_NAME=${REPO_NAME:-$(basename "$(realpath .)")}
VERSION=${VERSION:-"development"}

# Check for flags
FORCE=false
for arg in "$@"; do
  case "$arg" in
  --force)
    FORCE=true
    break
    ;;
  esac
done

# Prompt the user for input if not forced
if [ "$FORCE" = 'false' ]; then
  echo "Organization (default: $ORGANIZATION):"
  read input
  ORGANIZATION=${input:-$ORGANIZATION}

  echo "Repository (default: $REPO_NAME):"
  read input
  REPO_NAME=${input:-$REPO_NAME}

  echo "Version (default: development)"
  read input
  VERSION=${input:-'development'}
else
  if [ -e "$(dirname "$0")/../.env" ]; then
    . "$(dirname "$0")/../.env"
  fi
fi

# Fix for \r tag issues
if [ "$VERSION" != 'development' ]; then
  VERSION=$(echo "$VERSION" | tr -d '\r')
fi

# Docker build command
IMAGE_NAME=${IMAGE_NAME:-"$ORGANIZATION/$REPO_NAME"}
docker buildx build \
  -f docker/Dockerfile \
  --rm \
  --build-arg ORGANIZATION="$ORGANIZATION" \
  --build-arg REPO_NAME="$REPO_NAME" \
  --build-arg VERSION="$VERSION" \
  -t "$IMAGE_NAME:$VERSION" \
  .
