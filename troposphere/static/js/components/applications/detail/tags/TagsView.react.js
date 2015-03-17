define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      ViewTags = require('components/common/tags/ViewTags.react'),
      stores = require('stores');

  return React.createClass({

    propTypes: {
      application: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      tags: React.PropTypes.instanceOf(Backbone.Collection).isRequired
    },

    render: function () {
      var applicationTags = stores.TagStore.getImageTags(this.props.application);

      return (
        <div className="image-tags image-info-segment row">
          <h4 className="title col-md-2">Tags</h4>
          <div className="content col-md-10">
            <ViewTags activeTags={applicationTags}/>
          </div>
        </div>
      );

    }

  });

});
