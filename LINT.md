LINT.md
=======

This is a document to aid in linting of the project.

## Running the linter

Basic lint commands
```bash
npm run lint
```

## Rules

The configuration for eslint is to use the "recommended" set. You can review the recommended rules here: http://eslint.org/docs/rules/

This section notes the variation(s) from the "eslint:recommended" rules.

### General Rules

#### no-unused-vars

Its an error to have unused variables, but okay to have unused paramaters, so functions can demonstrate their interface even if its not currently used.

```
"no-unused-vars": ["error", {"args": "none"}]
```

### React-specific Rules

We do currently define two rules that are enforced via the React plugin for ESLint, `eslint-plugin-react`.

#### react/jsx-uses-vars
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

#### react/jsx-uses-react
This rule is more nuanced, and caters to a specific instance: A file contains
only jsx and a necessary React import. The file does not otherwise mention
React, eslint thinks React is an unused var. This option stifles the unused var
error. Note: "jsx-uses-react" is only effective with "no-unused-vars"
```
"react/jsx-uses-react": "error"
```

#### Toward a "React" recommended

We are currently working to adopt a recommended set of rules for the React plugin, as well.


## Documentation
- [eslint](http://eslint.org/docs/rules/)
- [eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react/tree/master/docs/rules)

## Advanced linting

This is a quick way to get the eslint command
```bash
npm i -g npm-run
alias eslint=npm-run eslint
```

Run the linter only on files changed in a feature branch
```bash
TRUNC=master
FEATURE="$(git rev-parse --abbrev-ref HEAD)"
FILES=$(git diff $TRUNC..$FEATURE --name-only | grep 'troposphere/static/js.*js$')

# You'll probably want to pass options to eslint (see package.json "lint")
eslint $FILES
```

Run a subset of rules over the codebase
```
RULES='{ "no-undef": "error" }'
eslint --env es6 --ext .js,.jsx --env browser --env commonjs --parser "babel-eslint" --rule "$RULES" --no-eslintrc troposphere/static/js
```

**Note:** `eslint` will **always** use the `.eslintrc` despite the use of the
`-c` flag.  The `--no-eslintrc` option will disable this. To be sure which
rules are being included use `--print-config`.
