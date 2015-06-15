.DEFAULT_GOAL =	all

.PHONY =	all clean delete delete-javascript delete-virtualenv bower-install gulp-dev gulp-prod \
		javascript js npm pip prod production python virtualenv chown

DJANGO	=	DJANGO_SETTINGS_MODULE='troposphere.settings' ./manage.py
BOWER	=	$(NODE) ./node_modules/bower/bin/bower --allow-root
GULP	=	$(NODE) ./node_modules/gulp/bin/gulp.js
NPM	=	npm
NODE	=	node
SHELL	=	/bin/bash

jenkins : npm bower-install gulp-dev relativevirtual jenkinspip django jenkinschown

all : npm bower-install gulp-dev virtualenv pip django chown

clean :
	$(GULP) clean
	$(BOWER) prune
	./scripts/rm_all_pyc.sh

delete : delete-javascript delete-virtualenv

delete-javascript :
	rm -rf ./node_modules/
	rm -rf ./troposphere/assets/
	rm -rf troposphere/static/bower_components/

delete-virtualenv :
	rm -rf /opt/env/troposphere/

bower-install : .bowerrc bower.json
	$(BOWER) install --config.interactive=false

gulp-dev : npm bower-install
	$(GULP)

gulp-prod : npm bower-install
	$(GULP) prod

javascript : npm bower-install gulp-dev

js : javascript

npm : package.json
	$(NPM) install

pip : virtualenv
	source /opt/env/troposphere/bin/activate;pip install -r requirements.txt

prod : gulp-prod

production : gulp-prod

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
	chown -R atmosphere:www-data .
