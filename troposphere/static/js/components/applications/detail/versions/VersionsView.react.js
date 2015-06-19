define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      VersionList = require('./VersionList.react');

  return React.createClass({

    propTypes: {
      application: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },
    render: function () {
      var image = this.props.application,
          versions = image.getVersions();
      if(!versions) {
          return (<div className="loading" />);
      }
      return (
        <div className="image-versions image-info-segment row">
          <h2 className="title col-md-2">Versions</h2>
          <VersionList application={image} versions={versions} editable={true}/>
        </div>
      );
    }

  });

});
