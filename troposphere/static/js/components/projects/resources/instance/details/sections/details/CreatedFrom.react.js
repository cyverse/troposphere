/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/projects/common/ResourceDetail.react',
    'url'
  ],
  function (React, Backbone, ResourceDetail, URL) {

    return React.createClass({

      propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        var instance = this.props.instance;
        var applicationUrl = URL.application({id: instance.get('application_uuid')}, {absolute: true});
        return (
          <ResourceDetail label="Based on">
            <a href={applicationUrl}>{instance.get('application_name')}</a>
          </ResourceDetail>
        );
      }

    });

  });
