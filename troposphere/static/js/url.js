/* Module for generating in-app urls */
define(
  [
    'underscore'
  ],
  function (_) {

    var generators = {

      instance: function (model) {
        var providerId = model.get('identity').provider;
        var identityId = model.get('identity').id;
        return 'provider/' + providerId + '/identity/' + identityId + '/instances/' + model.id;
      },

      reportInstance: function (data) {
        return generators.projectInstance(data) + '/report';
      },

      volume: function (model) {
        var providerId = model.get('identity').provider;
        var identityId = model.get('identity').id;
        return 'provider/' + providerId + '/identity/' + identityId + '/volumes/' + model.id;
      },

      application: function (model) {
        return 'images/' + model.id;
      },

      requestImage: function (data) {
        return generators.projectInstance(data) + '/request_image';
      },

      images: function () {
        return 'images';
      },

      help: function () {
        return 'help';
      },

      login: function () {
        return '/login'
      },

      projects: function ( ) {
        return 'projects';
      },

      project: function (project) {
        return 'projects/' + project.id;
      },

      projectInstance: function (data) {
        return generators.project(data.project) + '/instances/' + data.instance.id;
      },

      projectVolume: function (data) {
        return generators.project(data.project) + '/volumes/' + data.volume.id;
      }
    };

    var generateUrl = function (route, model, options) {
      options = options || {};
      var url = generators[route](model);

      if (options.relative) {
        url = '/' + url;
      } else {
        url = '/application/' + url;
      }
      return url;
    };

    return {
      instance: _.partial(generateUrl, 'instance'),
      reportInstance: _.partial(generateUrl, 'reportInstance'),
      volume: _.partial(generateUrl, 'volume'),
      application: _.partial(generateUrl, 'application'),
      images: _.partial(generateUrl, 'images'),
      help: _.partial(generateUrl, 'help'),
      requestImage: _.partial(generateUrl, 'requestImage'),
      login: _.partial(generateUrl, 'login'),
      projects: _.partial(generateUrl, 'projects'),
      project: _.partial(generateUrl, 'project'),
      projectInstance: _.partial(generateUrl, 'projectInstance'),
      projectVolume: _.partial(generateUrl, 'projectVolume')
    };

  });
