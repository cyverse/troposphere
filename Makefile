.DEFAULT_GOAL = all

.PHONY = all clean delete bower-install gulp-dev gulp-prod npm production prod

NPM	= npm
NODE	= node
GULP	= $(NODE) ./node_modules/gulp/bin/gulp.js
BOWER	= $(NODE) ./node_modules/bower/bin/bower --allow-root

all : npm bower-install gulp-dev

clean :
	$(GULP) clean
	$(BOWER) prune

delete :
	rm -rf ./node_modules/
	rm -rf ./troposphere/assets/
	rm -rf troposphere/static/bower_components/

bower-install : .bowerrc bower.json
	$(BOWER) install

gulp-dev : npm bower-install
	$(GULP)

gulp-prod : npm bower-install
	$(GULP) prod

npm : package.json
	$(NPM) install --link

production: gulp-prod

prod: gulp-prod
