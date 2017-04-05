# Theming in troposphere
 
You can change the images and colors used in troposphere to reflect your own
institution's branding. Normally this is handled with [clank](https://github.com/cyverse/clank) but if you want to customize the theme without running clank, you can edit `variables.ini` and run the `./configure` script in the root directory of this project.  
 
### Theme Images
To change an image like the logo or favicon make a copy of `themeImagesDefault` found in `<project root>/troposphere/static/theme` and name it `themeImages` keeping it in the theme folder.
 
In `variables.ini` set: 
```
USE_THEME_IMAGES = True
``` 
Replace any image in the folder with your new image keeping the same name and file type. It is important that the new image has the same dimensions and uses a transparent background or it may not display correctly. Your image may not be the same ratio as the image you are replacing but the file should be. For example, your logo might be shorter in length given the same height. Without distorting the logo ratio, align it to the left of the file and export the file at the same dimensions of the original file.
 
```
File Dimentions
+++++++++++++++++++++++++++
+--------------------     +
+| Logo Dimentions  |     +
+--------------------     +
+++++++++++++++++++++++++++
```
### Theme Colors
To change the theme colors, edit the color variable in `variables.ini`. These colors are used by Cyverse-ui and Material-ui for components like buttons, toggles, radios, etc... See our [style guide](https://cyverse.github.io/cyverse-ui) for more information on how colors are used by the components.

If you have not run clank before or had ran an older version you will have to add the theme variables and theme header to `variables.ini`.

Theme Variables Example:
```
[theme]
USE_THEME_IMAGES = False
PRIMARY_ONE_COLOR = "#ed174b"
PRIMARY_TWO_COLOR = "#46afc8"
ACCENT_ONE_COLOR = "#46afc8"
PICKER_HEADER_COLOR = "#46afc8"
DANGER_COLOR = "amber"
SUCCESS_COLOR = "green"
HEADER_COLOR = "white"
HEADER_BORDER_COLOR = "red"
HEADER_LINK_COLOR = "blue"
LINK_COLOR = "#46afc8"
```

Once you have the variables you want to change defined, run `./configure` from the root directory of this project. If successful you should see the following output:
```
Successfully generated configs:
        - extras/nginx/site.conf
        - troposphere/settings/local.py
        - extras/troposphere.uwsgi.ini
        - troposphere/static/theme/theme.json
        - extras/nginx/Makefile
        - themeImagesPath.js
        - troposphere/static/css/app/variables.scss
        - extras/nginx/locations/tropo.conf
```
