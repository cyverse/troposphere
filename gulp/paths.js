module.exports = {
  css: ['troposphere/static/css/**'],
  scripts: [
    'troposphere/static/js/**/*.js',
    '!troposphere/static/js/**/*.react.js'
  ],
  bowerComponents: 'troposphere/static/bower_components/**',
  images: ['troposphere/static/images/**'],
  rootSassFileForApp: 'troposphere/static/css/app/app.scss',
  //jsxTemplates: 'troposphere/static/js/**/*.jsx'
  jsxTemplates: 'troposphere/static/js/**/*.react.js'
};