import actions from 'actions';
import ModalHelpers from 'components/modals/ModalHelpers';
import FeedbackModal from 'components/modals/FeedbackModal.react';
import BadgeModal from 'components/modals/BadgeModal.react';

export default {
    ShowBadge: function(badge){
      ModalHelpers.renderModal(BadgeModal, {badge:badge}, function(){});
    }
};
