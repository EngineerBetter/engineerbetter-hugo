#!/bin/bash

set -eu

echo "${GOOGLE_CREDENTIALS}" >creds.json
gcloud config set project "$(jq -ner '.project_id' creds.json)"
gcloud auth activate-service-account --key-file=creds.json

gcloud container clusters get-credentials ebkf --zone europe-west2-b

kf push --space $SPACE --manifest eb-hugo/${MANIFEST}
