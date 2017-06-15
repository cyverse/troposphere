#!/bin/bash

#
# This scripts ensures that requirements were generated based on the
# instructions found in ../REQUIREMENTS.md
#
#   pip-compile -o requirements.txt requirements.in
#   pip-compile -o dev_requirements.txt  dev_requirements.in requirements.txt
#

# Return non-zero exit code if any sub command fails
set -e

function main {

    # Hide stderr/stdout, so we don't spit out huge diffs on failure
    exec &>/dev/null;

    # Ensure that requirements.txt were generated properly
    diff <(generate_requirements | remove_header) \
         <(cat requirements.txt  | remove_header);

    # Ensure that dev_requirements.txt were generated properly
    diff <(generate_dev_requirements | remove_header) \
         <(cat dev_requirements.txt  | remove_header);
}


function generate_requirements {
    pip-compile --dry-run -o requirements.txt requirements.in;
}

function generate_dev_requirements {
    pip-compile --dry-run -o dev_requirements.txt \
        dev_requirements.in requirements.txt;
}

function remove_header {
    grep -v "^#"
}

main
