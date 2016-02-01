define(function (require) {

  var React = require('react/addons'),
    Backbone = require('backbone'),
    stores = require('stores'),
    VersionList = require('./VersionList.react');

  return React.createClass({
    displayName: "VersionsView",

    propTypes: {
      image: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },
    render: function () {
      var image = this.props.image,
        versions = stores.ImageStore.getVersions(image.id);
      if(!versions) {
          return (<div className="loading" />);
      }
      return (
        <div className="image-versions image-info-segment row">
          <h4 className="t-title col-md-2">Versions:</h4>
          <VersionList image={image} versions={versions} editable={true}/>
        </div>
      );
    }

  });

});
