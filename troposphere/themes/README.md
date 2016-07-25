# Troposphere Theme Guide
_Note: Troposphere Theming is about to undergo a major change_

Troposphere themes can change the app's colors, the logo on the app bar, and some images to suit your organization's identity.
The theme is a CSS overwrite of the Bootstrap framework. The CSS is generated from the `.scss` SASS transpiled syntax. 

- [SASS](http://sass-lang.com/)
- [BootStrap](http://getbootstrap.com/)

## Getting Started
Because new themes are not part of the Troposphere repository, new themes are symlinked to `./troposphere/themes/` from somewhere outside of the root Troposphere directory.

_Note: We recomend creating a git repository for your theme_

#### Copy Theme

Start by copying a theme from the Troposphere theme folder to a location outside the root Troposphere directory.

From within the troposphere theme directory run:
```
cp -r troposphere_theme {path to your theme}/your-theme-name_theme
```

_Note: your theme folder name must end with_ `_theme`

#### Create Symbolic Link

Create a symbolic link from your theme to the Troposphere theme directory.

Using complete paths run:
```
ln -s {complete path}/your-theme-name_theme {complete path to app's root}/troposphere/themes
```

#### Add Your Theme to the App's Variables

In your `variables.ini` located in the root directory of your app Edit:

``` 
THEME_NAME="your-theme-name_theme" 
```

Then Run:
``` 
./configure 
```

#### Install Dependencies 

Install your theme's dependencies. This project uses `gulp` to transpile our `.scss` files and add vendor prefixes to our styles.

From within your theme's directory run:
```
npm i
```

#### Make Changes

Make your changes!

We recommend only changing colors and the images within the images folder as any other changes could have unforeseen side effects on your app's layout.

Most, if not all of your changes can be done through `theme.scss`. First change the color variables at the top, those variables are assigned to parts of your app's UI further down the file and on the other files. You can change these assignments as desired. 

Change the images in the images folder but keep the same name for them to be used in the app.

#### Build

Build your changes by running the gulp tasks defined in `gulpfile.js`. Here we transpile our `.scss` files, prefix our CSS and output a single `theme.scss` file to serve to the client.

From within your theme's folder run:
``` 
gulp
```

_Note: Once you build for the first time there will be a new directory and file_ `./css/theme.css`
 _Don't edit this file as the next time you run build this file will be overwritten._
#### Preview Changes and Repeat

The rest is simply a matter of making changes, building and previewing.
