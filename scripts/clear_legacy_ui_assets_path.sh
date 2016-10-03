#!/usr/bin/env bash

# Local Development Note:
#
# if you have chosen a $TROPOSPHERE_HOME other than the default,
# then `export` TROPOSPHERE_HOME for that location to get the
# expected behavior.

if [ -z ${TROPOSPHERE_HOME+x} ]; then
  TROPOSPHERE_HOME=/opt/dev/troposphere;
fi

export TROPOSPHERE_HOME;


if [[ -n ${TROPOSPHERE_HOME} ]]; then
    ASSETS=$TROPOSPHERE_HOME"/troposphere/assets/"
    echo "Removing all files & directories under: ${ASSETS}"

    IS_LINUX="/etc/lsb-release"
    if [ -z ${IS_LINUX+x} ]; then
        find ${ASSETS} -regextype posix-extended -regex ".*\.js(.map)?" -exec rm '{}' ';'
        find ${ASSETS} -regextype posix-extended -regex ".*\.css(.map)?" -exec rm '{}' ';'
        find ${ASSETS} -regextype posix-extended -regex ".*\.(woff|woff2|eot|ttf|svg)" -exec rm '{}' ';'
    else
        find -E ${ASSETS} -regex ".*\.js(.map)?" -exec rm '{}' ';'
        find -E ${ASSETS} -regex ".*\.css(.map)?" -exec rm '{}' ';'
        find -E ${ASSETS} -regex ".*\.(woff|woff2|eot|ttf|svg)" -exec rm '{}' ';'
    fi
fi
