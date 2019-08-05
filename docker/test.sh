#!/bin/bash

# Set so that if any command fails, the script will exit and fail
set -e

# Setup Troposphere environment
apt-get update && apt-get install -y postgresql
cd /opt/dev/troposphere
source /opt/env/troposphere/bin/activate

# Install pre-dependencies
pip install -U pip==9.0.3 setuptools
pip install pip-tools==1.11.0

# Wait for DB to be active
echo "Waiting for postgres..."
while ! nc -z localhost 5432; do sleep 5; done

pip install -r dev_requirements.txt
npm install
cp ./variables.ini.dist ./variables.ini
./configure
./travis/check_properly_generated_requirements.sh
./manage.py makemigrations --dry-run --check
./manage.py test
npm run build
npm run lint
npm run format -- -l
