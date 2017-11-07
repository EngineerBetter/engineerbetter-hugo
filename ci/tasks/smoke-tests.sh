#!/bin/bash

set -eu

assert_non_error_response() {
  curl --silent --fail -v --output /dev/null "${HOST}${1}"
}

assert_non_error_response_and_contains() {
  if curl --silent --fail -v "${HOST}${1}" --stderr - | grep -q "${2}"; then
    true
  else
    echo "${HOST}${1}" did not contain \""${2}"\"
    exit 1
  fi
}

assert_section_exists_with_redirect() {
  SECTION=$1
  TEXT=$2
  # Quite a faff to pass a regex through so we don't need to care which domain we're testing against
  assert_non_error_response_and_contains /"${SECTION}".html "/${SECTION}/\" />"
  assert_non_error_response_and_contains /"${SECTION}"/ "${TEXT}"
}

assert_non_error_response_and_contains / EngineerBetter
assert_section_exists_with_redirect about-us "<title>About us"
assert_section_exists_with_redirect how-we-work "<title>How we work"
assert_section_exists_with_redirect our-services "<title>Our services"
assert_section_exists_with_redirect success-stories "<title>Success Stories"

# Routes that point to blog app
assert_non_error_response /bad
assert_non_error_response /update/2017/10/05/post-devops.html
assert_non_error_response /why-eb.html
assert_non_error_response /2017/05/03/introducing-concourse-up.html
assert_non_error_response /2016/09/20/engineerbetter-hazelcast-cloud-foundry.html
assert_non_error_response /update/2015/05/15/cf-summit-2015-themes.html
assert_non_error_response /brain-aligned-delivery
assert_non_error_response /7-stages-of-bosh

echo Tests passed