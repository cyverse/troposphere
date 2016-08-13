#!/usr/bin/env bash

# Local Development Note:
#
# if you have chosen a $TROPOSPHERE_HOME other than the default,
# then `export` TROPOSPHERE_HOME for that location to get the
# expected behavior.

# this removes all pyc file under this location - recursively
if [ -z ${TROPOSPHERE_HOME+x} ]; then
  TROPOSPHERE_HOME=/opt/dev/troposphere;
fi

export TROPOSPHERE_HOME;

find ${TROPOSPHERE_HOME} -name "*.pyc" -exec rm '{}' ';'
