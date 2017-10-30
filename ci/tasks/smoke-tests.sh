#!/bin/bash

set -eu

assert_non_error_response() {
  curl --silent --fail -v --output /dev/null "${HOST}${1}"
}

assert_non_error_response /
assert_non_error_response /bad
assert_non_error_response /update/2017/10/05/post-devops.html
assert_non_error_response /why-eb.html
assert_non_error_response /2017/05/03/introducing-concourse-up.html
assert_non_error_response /2016/09/20/engineerbetter-hazelcast-cloud-foundry.html
assert_non_error_response /update/2015/05/15/cf-summit-2015-themes.html