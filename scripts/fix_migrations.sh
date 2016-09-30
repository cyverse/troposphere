#!/bin/bash -x

#Clear troposphere
su - postgres -c 'psql -d troposphere -c "delete from django_migrations where app='"'troposphere';\""
su - postgres -c 'psql -d troposphere -c "delete from django_migrations where app='"'iplantauth';\""
su - postgres -c "psql -d troposphere -c 'drop table troposphere_user cascade;'"
su - postgres -c "psql -d troposphere -c 'drop table iplantauth_accesstoken cascade;'"
su - postgres -c "psql -d troposphere -c 'drop table iplantauth_token cascade;'"
su - postgres -c "psql -d troposphere -c 'drop table iplantauth_userproxy cascade;'"
su - postgres -c "psql -d troposphere -c 'drop table troposphere_user_groups cascade;'"
su - postgres -c "psql -d troposphere -c 'drop table troposphere_user_user_permissions cascade;'"

#Clear atmosphere

