#!/bin/bash

set -eu

hugo --destination ../generated-site

cp ci/assets/buildpack.yml ../generated-site/

pushd ../generated-site
  tar -czf ../tarball/eb-hugo-built.tar.gz .
popd
