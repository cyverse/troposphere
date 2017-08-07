Troposphere
===========

## Installation

### Troposphere's backend

Install the required python packages
```
pip install -r requirements.txt
```

A separate environment is provided for developers
```
pip install -r dev_requirements.txt
```

The `*requirements.txt` files are generated using
[pip-tools](https://github.com/jazzband/pip-tools). See
[REQUIREMENTS.md](REQUIREMENTS.md) for instructions on using pip-tools and
upgrading packages in Troposphere.


## Development

### Quick feedback

The `webpack-dev-server` will serve new bundles to a browser when files
change.

It has the following features:

- Changes result in a browser refresh (you know they are propagated)
- The bundle is served from memory not disk
- Small changes result in small compiles

Currently troposphere uses nginx to serve its assets. This makes it trivial to
serve these assets from the dev server.

Update your nginx definition (at `/etc/nginx/locations/tropo.conf`)
```nginx
location /assets {
    # This just needs to point to the dev server which runs on 8080
    proxy_pass https://server.example.com:8080;
}
```

Finally start the dev server:
```bash
npm run serve -- --host server.example.com --port 8080 --https  --cert /path/to/cert --key /path/to/key
```

If you would like to enable CSS hot reloading, prefix the npm command like so:
```bash
CSS_IN_JS=true npm run serve ...
```
By default we extract CSS from the larger bundle into a separate asset that is
parsed/loaded before any js, this ensures that the content of our html will be
styled the first time it is shown. However, CSS hot reloading only works if
the CSS is shipped in the JS. The caveat is that html content is shipped
without initial styling.

**Note:** `CSS_IN_JS` is completely ignored in a production environment.


### Linting

See `LINT.md`

### Coding Style

- Use an [EditorConfig](http://editorconfig.org/) plugin to leverage the project's `.editorconfig`

#### Git Hooks
The hooks below give helpful hints about common tasks like migrating, or
installing dependencies.

Link the following hook to get these hints after pulling in code.
From the root of the project:
```bash
ln -fs ../../extras/hooks/post-merge.hook .git/hooks/post-merge
```
