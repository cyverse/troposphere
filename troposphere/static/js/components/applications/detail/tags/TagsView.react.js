/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'context',
    './ViewTagsView.react',
    './EditTagsView.react'
  ],
  function (React, Backbone, context, ViewTagsView, EditTagsView) {

    return React.createClass({

      propTypes: {
        application: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        tags: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {

        if(context.profile && context.profile.get('username') === this.props.application.get('created_by')){
          return (
            <EditTagsView application={this.props.application}
                          tags={this.props.tags}
            />
          );

        }else{
          return (
            <ViewTagsView tags={this.props.tags}
                          application={this.props.application}
            />
          );
        }

      }

    });

  });
