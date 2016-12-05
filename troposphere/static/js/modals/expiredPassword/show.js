import ModalHelpers from "components/modals/ModalHelpers";

import ExpiredPasswordModal from 'components/modals/ExpiredPassword';


let show = function() {
    ModalHelpers.renderModal(
        ExpiredPasswordModal,
        {},
        function() {}
    );
};

export { show }
