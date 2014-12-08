/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'jquery',

    // plugins
    'bootstrap'
  ],
  function (React, Backbone, $) {

    var maxDescriptionLength = 200;

    return React.createClass({

      propTypes: {
        application: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      componentDidMount: function (e) {
        var app = this.props.application,
            description = app.get('description');

        if(description.length > maxDescriptionLength){
          var el = this.getDOMNode();
          var $el = $(el);
          $el.tooltip({
            title: description
          });
        }
      },

      render: function () {
        var app = this.props.application,
            description = app.get('description');

        if(description.length > maxDescriptionLength){
          description = app.get('description').slice(0, maxDescriptionLength - 3) + "..."
        }

        return (
          <p className="description">{description}</p>
        );
      }

    });

  });
