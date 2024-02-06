#!/usr/bin/env sh

# Check for flags
LOCAL=false; REMOTE=false
for arg in "$@"; do
  case "$arg" in
  --local)
    LOCAL=true
    break
    ;;
  --remote)
    REMOTE=true
    break
    ;;
  esac
done

# Set default local values
if [ "$REMOTE" = 'false' ]; then
  ORGANIZATION=${ORGANIZATION:-$(basename "$(realpath ..)")}
  REPO_NAME=${REPO_NAME:-$(basename "$(realpath .)")}
  VERSION=${VERSION:-"development"}
fi

# Prompt the user for input if not forced (i.e. 'local' or 'remote')
if [ "$LOCAL" = 'false' && "$REMOTE" == 'false' ]; then
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

# Local Docker build command
if [ "$REMOTE" = 'false' ]; then
  IMAGE_NAME=${IMAGE_NAME:-"$ORGANIZATION/$REPO_NAME"}
  docker buildx build \
    -f docker/Dockerfile \
    --rm \
    --build-arg VERSION="$VERSION" \
    -t "$IMAGE_NAME:$VERSION" \
    .
fi

if [ "$REMOTE" = 'true' ]; then
  docker build -f docker/Dockerfile --rm -t .
fi