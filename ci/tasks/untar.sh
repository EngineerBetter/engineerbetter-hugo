#!/bin/bash

set -eu

pushd input
  tar -zxf *.tar.gz -C ../output/
popd
