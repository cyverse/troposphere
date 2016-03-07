define(function (require) {
  "use strict";

  var actions = require('actions'),
      ModalHelpers = require('components/modals/ModalHelpers'),
      BadgeHelp = require('components/modals/BadgeHelp.react');
  return {

    ShowHelp: function(){
      ModalHelpers.renderModal(BadgeHelp, {}, function(){});
    }

  };

});
