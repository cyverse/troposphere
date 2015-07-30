define(function (require) {

  var React = require('react'),
    _ = require('underscore'),
    Version = require('./Version.react'),
    stores = require('stores'),
    //Modals
    ImageVersionEditModal = require('components/modals/image_version/ImageVersionEditModal.react'),
    ModalHelpers = require('components/modals/ModalHelpers'),
    actions = require('actions');

  return React.createClass({
      displayName: "VersionList",

      propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        versions: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        editable: React.PropTypes.bool
      },
      //TODO: Next refactor should convert this into 'edit version'
      openEditVersion: function (version) {

        var props = {version: version, image: this.props.image};

        ModalHelpers.renderModal(ImageVersionEditModal, props, this.onCompletedEdit);

      },
      onCompletedEdit: function (version, end_date, uncopyable, image, licenses, memberships) {
        if (end_date !== null) {
          end_date = new Date(Date.parse(end_date)).toISOString()
        }
        actions.ImageVersionActions.update(version, {
          end_date: end_date,
          allow_imaging: uncopyable,
          licenses: licenses,
          memberships: memberships
        });
      },
      renderVersion: function (version) {
        return (
          <Version
            key={version.id}
            version={version}
            image={this.props.image}
            editable={this.props.editable}
            onEditClicked={this.openEditVersion}
            />
        );
      },
      getVersions: function (versions) {
        var versions = [],
          partialLoad = false;
        //Wait for it...
        if (!versions) {
          return null;
        }
        versions.map(function (version) {
          var _versions = stores.ImageVersionStore.getVersions(version.id);
          if (!_versions) {
            partialLoad = true;
            return;
          }
          versions = versions.concat(_versions);
        });

        //Don't try to render until you are 100% ready
        if (partialLoad) {
          return null;
        }

        return versions;
      }
      ,
      render: function () {

        //TODO: Add 'sort by' && '+/-'
        //      API ordering filters: Start Date _OR_ parent-hierarchy
        return (
          <div className="content col-md-10">
            <ul>
              {this.props.versions.map(this.renderVersion)}
            </ul>
          </div>
        );
      }

    }
  )
    ;

})
;
