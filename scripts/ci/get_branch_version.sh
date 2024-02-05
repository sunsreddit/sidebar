#!/usr/bin/env sh

# Determine version increment
case $GITHUB_REF_NAME in
  main)
    version=bump
    break
    ;;
  release*|major*|v*)
    version=major
    break
    ;;
  feature*)
    version=minor
    break
    ;;
  bugfix*|hotfix*)
    version=patch
    break
    ;;
  *)
    version=bump
    break
    ;;
esac

echo "$version"