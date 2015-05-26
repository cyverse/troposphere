define(function (require) {
  'use strict';

  var TagConstants = require('constants/TagConstants'),
      Tag = require('models/Tag'),
      actions = require('actions'),
      Utils = require('../Utils');

  return {

    create: function(params){
      if(!params.name) throw new Error("Missing name");
      if(!params.description) throw new Error("Missing description");

      var name = params.name,
          description = params.description;

      var tag = new Tag({
        name: name,
        description: description
      });

      // Add the tag optimistically
      Utils.dispatch(TagConstants.ADD_TAG, {tag: tag}, {silent: false});

      tag.save().done(function () {
        Utils.dispatch(TagConstants.UPDATE_TAG, {tag: tag}, {silent: false});
      }).fail(function () {
        Utils.dispatch(TagConstants.REMOVE_TAG, {tag: tag}, {silent: false});
      });
    }

  };

});
