Troposphere
===========
                                                        
## Development

### Continuous development and quick feedback

The `webpack-dev-server` will serve new bundles to a browser when files
change.

It has the following features:

- Changes result in a browser refresh (you know they are propagated)      
- The bundle is served from memory not disk
- Small changes result in small compiles

To run webpack dev server:

Set the following variable in `variables.ini`:
```bash
[local.py]
...
BASE_URL = "https://<host name>:8080"
...
```

Finally run:

```bash
npm run server
```

### Linting

See `LINT.md`

### Coding Style

- Use an [EditorConfig](http://editorconfig.org/) plugin to leverage the project's `.editorconfig`
- Install provided Git Hooks

#### Git Hooks
It is recommended that you use the git `pre-commit` hook to ensure your code
is compliant with our style guide.

```bash
ln -s contrib/pre-commit.hook .git/hooks/pre-commit
```

To automate running tests before a push use the git `pre-push` hook to ensure
your code passes all the tests.

```bash
ln -s contrib/pre-push.hook .git/hooks/pre-push
```

When master is pulled, it's helpful to know if a `pip install`, `npm install`, or a `manage.py
migrate` is necessary. To get a helpful warning:
```bash
ln -s contrib/post-merge.hook .git/hooks/post-merge
```

