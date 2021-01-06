#!/bin/bash

set -eu

echo "${GOOGLE_CREDENTIALS}" >creds.json
export GOOGLE_APPLICATION_CREDENTIALS=creds.json

gcloud container clusters get-credentials ebkf --zone europe-west2-b

kf push --space $SPACE --manifest eb-hugo/${MANIFEST}
