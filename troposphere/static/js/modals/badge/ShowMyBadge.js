import ModalHelpers from 'components/modals/ModalHelpers';
import MyBadgeModal from 'components/modals/MyBadgeModal.react';

export default {
    ShowMyBadge: function(badge){
      ModalHelpers.renderModal(MyBadgeModal, {badge:badge}, function(){});
    }
};
