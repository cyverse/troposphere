define(function (require) {
  "use strict";

  var actions = require('actions'),
    ModalHelpers = require('components/modals/ModalHelpers'),
    ManageUserModal = require('components/modals/admin/ManageUserModal.react');
  return {

    showModal: function (ident_member) {

      var props = {
          ident_member: ident_member,
          header: "Disable User"
      };

      ModalHelpers.renderModal(ManageUserModal, props, function () {
      });
    }

  };

});
