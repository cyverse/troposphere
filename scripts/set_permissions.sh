#!/usr/bin/env bash
if [[ $EUID -ne 0 ]]; then
    echo "You must be a root user to set these permissions"
    exit 1
fi

export TROPOSPHERE_HOME=/opt/dev/troposphere

chmod -R g+w ${TROPOSPHERE_HOME}

chown -R www-data:core-services ${TROPOSPHERE_HOME}
