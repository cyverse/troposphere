.DEFAULT_GOAL =	all

.PHONY =	all clean delete delete-javascript delete-virtualenv dev dev-full \
    webpack-dev webpack-prod javascript js static npm pip prod production python \
    virtualenv chown

DJANGO	=	DJANGO_SETTINGS_MODULE='troposphere.settings' ./manage.py
WEBPACK =	$(NPM) run build
WEBPACK_DEV = $(NPM) run dev
JENKINS_WEBPACK =	$(NPM) run jenkins
NPM	    =	npm
NODE	=	node
SHELL	=	/bin/bash

jenkins : npm webpack-jenkins static relativevirtual jenkinspip django jenkinschown

all : npm webpack-dev static virtualenv pip django chown

clean :
	./scripts/rm_all_pyc.sh

delete : delete-javascript delete-virtualenv

delete-javascript :
	rm -rf ./node_modules/
	rm -rf ./troposphere/assets/

delete-virtualenv :
	rm -rf /opt/env/troposphere/

dev-full : npm webpack-dev

dev : webpack-dev

webpack-dev :
	$(WEBPACK_DEV) -d --progress

webpack-jenkins : npm
	$(JENKINS_WEBPACK)

webpack-prod : npm
	$(WEBPACK) --production

javascript : webpack-dev static

js : javascript

static :
	$(DJANGO) collectstatic

npm : package.json
	$(NPM) install

pip : virtualenv
	source /opt/env/troposphere/bin/activate;pip install -r requirements.txt

prod : webpack-prod static

production : webpack-prod static

python : virtualenv pip

django :
	$(DJANGO) migrate

virtualenv :
	mkdir -p /opt/env
	-virtualenv /opt/env/troposphere

relativevirtual :
	-virtualenv env

jenkinspip : relativevirtual
	source ./env/bin/activate;pip install -r dev_requirements.txt

jenkinschown :
	chown -R jenkins:jenkins ./env

chown :
	chown -R www-data: .
