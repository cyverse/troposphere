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
