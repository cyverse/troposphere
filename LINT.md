LINT.md
=======

This is a document to aid in linting of the project.

### Conventions

.eslintrc
  - Should make you happy when it fails
  - Shouldn't get in the way
  - Blacklist anything nit-picky

.eslintrc.strict
  - Should make you happy when it mostly succeeds
  - Ideal for subset of the codebase, i.e. changes in a feature branch

.eslintrc.travis
  - Should rarely error out

### Documentation
- [eslint](http://eslint.org/docs/rules/)
- [eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react/tree/master/docs/rules)

### Running the linters

This is a quick way to get the eslint command
```bash
npm i -g npm-run
alias eslint=npm-run eslint
```

Basic lint commands
```bash
eslint troposphere/static/js
eslint -c .eslintrc.strict troposphere/static/js
```

Run the strict linter on current feature branch
```bash
TRUNC=master
FEATURE="$(git rev-parse --abbrev-ref HEAD)"
FILES=$(git diff $TRUNC..$FEATURE --name-only | grep 'troposphere/static/js.*js$')
eslint -c .eslintrc.strict $FILES
```
**Note:** `eslint` will **always** use the `.eslintrc` despite the use of the
`-c` flag.  The `--no-eslintrc` option will disable this. To be sure which
rules are being included use `--print-config`.

Run a subset of rules over the codebase
```
RULES='{ "no-undef": 2 }'
eslint --env es6 --env browser --env commonjs --parser "babel-eslint" --rule "$RULES" --no-eslintrc troposphere/static/js
```
