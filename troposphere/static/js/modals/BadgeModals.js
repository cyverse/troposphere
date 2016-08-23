import BadgeModal from "./badge/ShowBadge";
import MyBadgeModal from "./badge/ShowMyBadge";
import showHelp from "./badge/ShowHelp";

var BadgeModals = {
    showHelp: showHelp,
    showBadge: BadgeModal.ShowBadge,
    showMyBadge: MyBadgeModal.ShowMyBadge
};

export default BadgeModals;
