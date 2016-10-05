// Note: while we could include all the stores here, I'm not going to
// instead, I'm going to let the application load the stores it needs
// to use during the bootstrapping process so that the application
// will throw exceptions if any stores don't exist (which will be the default
// state for functional tests that need mocked stores)

import ProfileStore from "stores/ProfileStore";
import AllocationStore from "stores/AllocationStore";
import BadgeStore from "stores/BadgeStore";
import ExternalLinkStore from "stores/ExternalLinkStore";
import HelpLinkStore from "stores/HelpLinkStore";
import ImageStore from "stores/ImageStore";
import ImageVersionStore from "stores/ImageVersionStore";
import ImageVersionMembershipStore from "stores/ImageVersionMembershipStore";
import ImageVersionLicenseStore from "stores/ImageVersionLicenseStore";
import ImageVersionScriptStore from "stores/ImageVersionScriptStore";
import IdentityStore from "stores/IdentityStore";
import ImageBookmarkStore from "stores/ImageBookmarkStore";
import InstanceHistoryStore from "stores/InstanceHistoryStore";
import ImageRequestStore from "stores/ImageRequestStore";
import InstanceStore from "stores/InstanceStore";
import InstanceTagStore from "stores/InstanceTagStore";
import LicenseStore from "stores/LicenseStore";
import ScriptStore from "stores/ScriptStore";
import MaintenanceMessageStore from "stores/MaintenanceMessageStore";
import MyBadgeStore from "stores/MyBadgeStore";
import MembershipStore from "stores/MembershipStore";
import ProjectStore from "stores/ProjectStore";
import ProjectExternalLinkStore from "stores/ProjectExternalLinkStore";
import ProjectImageStore from "stores/ProjectImageStore";
import ProjectInstanceStore from "stores/ProjectInstanceStore";
import ProjectVolumeStore from "stores/ProjectVolumeStore";
import ProviderMachineStore from "stores/ProviderMachineStore";
import ProviderStore from "stores/ProviderStore";
import ResourceRequestStore from "stores/ResourceRequestStore";
import IdentityMembershipStore from "stores/IdentityMembershipStore";
import StatusStore from "stores/StatusStore";
import SSHKeyStore from "stores/SSHKeyStore";
import QuotaStore from "stores/QuotaStore";
import SizeStore from "stores/SizeStore";
import TagStore from "stores/TagStore";
import UserStore from "stores/UserStore";
import VersionStore from "stores/VersionStore";
import VolumeStore from "stores/VolumeStore";
import AllocationSourceStore from "stores/AllocationSourceStore";

export default {
    ProfileStore,
    AllocationStore,
    BadgeStore,
    ExternalLinkStore,
    HelpLinkStore,
    ImageStore,
    ImageVersionStore,
    ImageVersionMembershipStore,
    ImageVersionLicenseStore,
    ImageVersionScriptStore,
    IdentityStore,
    ImageBookmarkStore,
    InstanceHistoryStore,
    ImageRequestStore,
    InstanceStore,
    InstanceTagStore,
    LicenseStore,
    ScriptStore,
    MaintenanceMessageStore,
    MyBadgeStore,
    MembershipStore,
    ProjectStore,
    ProjectExternalLinkStore,
    ProjectImageStore,
    ProjectInstanceStore,
    ProjectVolumeStore,
    ProviderMachineStore,
    ProviderStore,
    ResourceRequestStore,
    IdentityMembershipStore,
    StatusStore,
    SSHKeyStore,
    QuotaStore,
    SizeStore,
    TagStore,
    UserStore,
    VersionStore,
    VolumeStore,
    AllocationSourceStore,
}
