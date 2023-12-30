#!/bin/bash

  # Function to get the parent folder name
  get_parent_folder_name() {
    echo $(basename "$(realpath ..)")
  }

  # Set default values
  MAINTAINER_NAME=${MAINTAINER_NAME:-$(get_parent_folder_name)}
  REPO_NAME=${REPO_NAME:-$(basename "$(realpath .)")}
  VERSION=${VERSION:-"development"}

  # Check for --no-prompt flag
  if [[ "$*" == *"--force"* ]]; then
    if [ -e ".env" ]; then
      source ".env"
    fi
  else
    # Prompt the user for input
    echo "Maintainer (default: $MAINTAINER_NAME):"
    read input
    MAINTAINER_NAME=${input:-$MAINTAINER_NAME}

    echo "Repository (default: $REPO_NAME):"
    read input
    REPO_NAME=${input:-$REPO_NAME}

    echo "Version (default: development)"
    read input
    VERSION=${input:-'development'}
  fi

  # Docker build command

  # some weird interpolation shit. fixes \r tag issues
  if [ $VERSION != 'development' ]; then
    VERSION="${VERSION//$'\r'/}"
  fi

  IMAGE_NAME="$MAINTAINER_NAME/$REPO_NAME"
  docker buildx build \
    -f docker/Dockerfile \
    --build-arg MAINTAINER_NAME="$MAINTAINER_NAME" \
    --build-arg REPO_NAME="$REPO_NAME" \
    --build-arg VERSION="$VERSION" \
    -t "$IMAGE_NAME:$VERSION" \
    .