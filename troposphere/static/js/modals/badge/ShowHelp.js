var ModalHelpers = require('components/modals/ModalHelpers');
var BadgeHelp = require('components/modals/BadgeHelp.react');

var showHelp = function () {
    ModalHelpers.renderModal(BadgeHelp, {}, function (){});
};

export default showHelp;
