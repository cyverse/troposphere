LINT.md
=======

This is a document to aid in linting of the project.

## Conventions

`.eslintrc`
  - Should make you happy when it fails
  - Shouldn't get in the way
  - Blacklist anything nit-picky

`.eslintrc.travis`
  - Should rarely error out

## Running the linters

Basic lint commands
```bash
npm run lint
npm run travis-lint
```

## Rules
Here are some of the less clear rules that we use.

### no-unused-vars
Its an error to have unused variables, but okay to have unused paramaters, so
functions can demonstrate their interface even if its not currently used.
```
"no-unused-vars": [2, {"args": "none"}]
```

### react/jsx-uses-vars
This rule is necessary to allow variables in jsx.
```
import ReactComponent from '...'
...
    <ReactComponent ... />
...
```
It's not so much a rule as a feature.
```
"react/jsx-uses-vars": "error"
```

### react/jsx-uses-react
This rule is more nuanced, and caters to a specific instance: A file contains
only jsx and a necessary React import. The file does not otherwise mention
React, eslint thinks React is an unused var. This option stifles the unused var
error. Note: "jsx-uses-react" is only effective with "no-unused-vars"
```
"react/jsx-uses-react": "error"
```

## Documentation
- [eslint](http://eslint.org/docs/rules/)
- [eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react/tree/master/docs/rules)

## Advanced linting

This is a quick way to get the eslint command
```bash
npm i -g npm-run
alias eslint=npm-run eslint
```

Run the linter on current feature branch
```bash
TRUNC=master
FEATURE="$(git rev-parse --abbrev-ref HEAD)"
FILES=$(git diff $TRUNC..$FEATURE --name-only | grep 'troposphere/static/js.*js$')
eslint $FILES
```

Run a subset of rules over the codebase
```
RULES='{ "no-undef": 2 }'
eslint --env es6 --env browser --env commonjs --parser "babel-eslint" --rule "$RULES" --no-eslintrc troposphere/static/js
```

**Note:** `eslint` will **always** use the `.eslintrc` despite the use of the
`-c` flag.  The `--no-eslintrc` option will disable this. To be sure which
rules are being included use `--print-config`.
