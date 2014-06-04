module.exports = {
  css: ['troposphere/static/css/**'],
  scripts: [
    'troposphere/static/js/**/*.js',
    '!troposphere/static/js/**/*.react.js'
  ],
  bowerComponents: 'troposphere/static/bower_components/**',
  images: ['troposphere/static/images/**'],
  rootSassFileForApp: 'troposphere/static/css/app/app.scss',
  rootSassFileForNoUser: 'troposphere/static/css/no_user.scss',
  //jsxTemplates: 'troposphere/static/js/**/*.jsx'
  jsxTemplates: 'troposphere/static/js/**/*.react.js'
};