.DEFAULT_GOAL =	all

.PHONY =	all clean delete delete-javascript delete-virtualenv webpack-dev webpack-prod \
		javascript js npm pip prod production python virtualenv chown

DJANGO	=	DJANGO_SETTINGS_MODULE='troposphere.settings' ./manage.py
WEBPACK =	$(NPM) run build
NPM	    =	npm
NODE	=	node
SHELL	=	/bin/bash

jenkins : npm webpack-dev relativevirtual jenkinspip django jenkinschown

all : npm webpack-dev virtualenv pip django chown

clean :
	./scripts/rm_all_pyc.sh

delete : delete-javascript delete-virtualenv

delete-javascript :
	rm -rf ./node_modules/
	rm -rf ./troposphere/assets/

delete-virtualenv :
	rm -rf /opt/env/troposphere/

webpack-dev : npm
	$(WEBPACK)

webpack-prod : npm
	$(WEBPACK) --production

javascript : npm

js : javascript

npm : package.json
	$(NPM) install

pip : virtualenv
	source /opt/env/troposphere/bin/activate;pip install -r requirements.txt

prod : webpack-prod

production : webpack-prod

python : virtualenv pip

django :
	$(DJANGO) migrate

virtualenv :
	mkdir -p /opt/env
	-virtualenv /opt/env/troposphere

relativevirtual :
	-virtualenv env

jenkinspip : relativevirtual
	source ./env/bin/activate;pip install -r requirements.txt

jenkinschown :
	chown -R jenkins:jenkins ./env

chown :
	chown -R www-data: .
