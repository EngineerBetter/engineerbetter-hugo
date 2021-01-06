#!/bin/bash

set -eu

gcloud container clusters get-credentials ebkf --zone europe-west2-b

kf push --space $SPACE --manifest eb-hugo/${MANIFEST}
