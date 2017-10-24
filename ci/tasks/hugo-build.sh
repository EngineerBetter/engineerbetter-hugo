#!/bin/bash
set -eu

hugo -d ../generated-site

pushd ../generated-site
  tar -czf ../tarball/eb-hugo-built.tar.gz .
popd