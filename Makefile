.DEFAULT_GOAL =	all

.PHONY =	all clean delete delete-javascript delete-virtualenv webpack-dev webpack-prod \
		javascript js cf2 npm pip prod production python virtualenv chown

DJANGO	=	DJANGO_SETTINGS_MODULE='troposphere.settings' ./manage.py
WEBPACK =	$(NPM) run build
JENKINS_WEBPACK =	$(NPM) run jenkins
NPM	    =	npm
NODE	=	node
SHELL	=	/bin/bash

jenkins : npm webpack-dev cf2 relativevirtual jenkinspip django jenkinschown

all : npm webpack-dev cf2 virtualenv pip django chown

clean :
	./scripts/rm_all_pyc.sh

delete : delete-javascript delete-virtualenv

delete-javascript :
	rm -rf ./node_modules/
	rm -rf ./troposphere/assets/

delete-virtualenv :
	rm -rf /opt/env/troposphere/

webpack-dev : npm
	$(WEBPACK) --progress

webpack-jenkins : npm
	$(JENKINS_WEBPACK)

webpack-prod : npm
	$(WEBPACK) --production

javascript : webpack-dev cf2

js : javascript

cf2 :
	cp -r ./troposphere/static/resources ./troposphere/assets/

npm : package.json
	$(NPM) install

pip : virtualenv
	source /opt/env/troposphere/bin/activate;pip install -r requirements.txt

prod : webpack-prod cf2

production : webpack-prod cf2

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
