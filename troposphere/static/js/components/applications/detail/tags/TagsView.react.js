/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/common/tags/ViewTags.react',
    'stores'
  ],
  function (React, Backbone, ViewTags, stores) {

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
              <ViewTags tags={this.props.tags}
                        activeTags={applicationTags}
              />
            </div>
          </div>
        );

      }

    });

  });
