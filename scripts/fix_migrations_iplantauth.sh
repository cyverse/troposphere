#!/bin/bash -x

ATMO_DB='troposphere'
#Fix the migrations in atmosphere db
psql_command="update django_migrations set app='django_cyverse_auth' where app='iplantauth';"
su - postgres -c "psql -d $ATMO_DB -c \"$psql_command\""
