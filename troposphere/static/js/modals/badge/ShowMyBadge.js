import ModalHelpers from 'components/modals/ModalHelpers';
import BadgeModal from 'components/modals/BadgeModal.react';


export default {
    ShowMyBadge: function(badge){
      ModalHelpers.renderModal(BadgeModal, {badge:badge}, function(){});
    }
};
