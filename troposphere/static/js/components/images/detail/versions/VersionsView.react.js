import React from 'react/addons';
import Backbone from 'backbone';
import stores from 'stores';
import VersionList from './VersionList.react';

export default React.createClass({
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
          <h4 className="title col-md-2">Versions:</h4>
          <VersionList image={image} versions={versions} editable={true}/>
        </div>
      );
    }
});
