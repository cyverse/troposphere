/* Module for generating in-app urls */

import _ from 'underscore';

let generators = {

    instance: function(model) {
        var providerId = model.get('identity').provider;
        var identityId = model.get('identity').id;
        return 'provider/' + providerId + '/identity/' + identityId + '/instances/' + model.id;
    },

    reportInstance: function(data) {
        return generators.projectInstance(data) + '/report';
    },

    volume: function(model) {
        var providerId = model.get('identity').provider;
        var identityId = model.get('identity').id;
        return 'provider/' + providerId + '/identity/' + identityId + '/volumes/' + model.id;
    },

    image: function(model) {
        return 'images/' + model.id;
    },

    images: function() {
        return 'images';
    },

    imageSearch: function(data) {
        return generators.images() + '/search/' + data.query;
    },

    help: function() {
        return 'help';
    },

    settings: function() {
        return 'settings';
    },

    login: function() {
        return 'login'
    },

    projects: function() {
        return 'projects';
    },

    project: function(project) {
        return 'projects/' + project.id;
    },

    projectInstance: function(data) {
        return generators.project(data.project) + '/instances/' + data.instance.id;
    },

    projectVolume: function(data) {
        return generators.project(data.project) + '/volumes/' + data.volume.id;
    },

    projectResources: function(data) {
        return generators.project(data.project) + '/resources';
    }
};

let generateUrl = function(route, model, options) {
    options = options || {};
    var url = generators[route](model);

    if (options.relative) {
        url = '/' + url;
    } else {
        url = '/image/' + url;
    }
    return url;
};

export default {
    instance: _.partial(generateUrl, 'instance'),
    reportInstance: _.partial(generateUrl, 'reportInstance'),
    volume: _.partial(generateUrl, 'volume'),
    image: _.partial(generateUrl, 'image'),
    images: _.partial(generateUrl, 'images'),
    imageSearch: _.partial(generateUrl, 'imageSearch'),
    help: _.partial(generateUrl, 'help'),
    settings: _.partial(generateUrl, 'settings'),
    login: _.partial(generateUrl, 'login'),
    projects: _.partial(generateUrl, 'projects'),
    project: _.partial(generateUrl, 'project'),
    projectInstance: _.partial(generateUrl, 'projectInstance'),
    projectVolume: _.partial(generateUrl, 'projectVolume'),
    projectResources: _.partial(generateUrl, 'projectResources')
};
