define(function (require) {

  var React = require('react/addons'),
    Backbone = require('backbone'),
    ViewTags = require('components/common/tags/ViewTags.react'),
    stores = require('stores');

  return React.createClass({
    displayName: "TagsView",

    propTypes: {
      image: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      tags: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
      renderLinks: React.PropTypes.bool
    },

    getDefaultProps: function () {
      return {
        renderLinks: true
      }
    },

    render: function () {
      var imageTags = stores.TagStore.getImageTags(this.props.image);

      return (
        <div className="image-tags image-info-segment row">
          <h4 className="title col-md-2">Tags:</h4>
          <div className="content col-md-10">
            <ViewTags activeTags={imageTags} renderLinks={this.props.renderLinks}/>
          </div>
        </div>
      );

    }

  });

});
