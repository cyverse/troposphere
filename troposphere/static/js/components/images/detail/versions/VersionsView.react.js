define(function (require) {

  var React = require('react/addons'),
    Backbone = require('backbone'),
    context = require('context'),
    stores = require('stores'),
    VersionList = require('./VersionList.react');

  return React.createClass({
    displayName: "VersionsView",

    propTypes: {
      image: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },
    render: function () {
      var image = this.props.image,
        versions = stores.ImageStore.getVersions(image.id),
        showAvailableOn = !!(context.profile && context.profile.get('username'));

      if(!versions) {
          return (<div className="loading" />);
      }
      return (
        <div className="image-versions image-info-segment row">
          <h4 className="title col-md-2">Versions:</h4>
          <VersionList image={image}
            versions={versions}
            editable={true}
            showAvailability={showAvailableOn} />
        </div>
      );
    }

  });

});
