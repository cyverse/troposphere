import actions from 'actions';
import ModalHelpers from 'components/modals/ModalHelpers';
import FeedbackModal from 'components/modals/FeedbackModal.react';
import MyBadgeModal from 'components/modals/MyBadgeModal.react';

export default {
    ShowMyBadge: function(badge){
      ModalHelpers.renderModal(MyBadgeModal, {badge:badge}, function(){});
    }
};
