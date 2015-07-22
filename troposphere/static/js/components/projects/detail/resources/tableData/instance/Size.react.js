/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'stores'
  ],
  function (React, Backbone, stores) {

    return React.createClass({

      propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        var instance = this.props.instance,
          size = stores.SizeStore.get(instance.get('size').id);

        if (!size) {
          return (
            <div className="loading-tiny-inline"></div>
          );
        }

        return (
          <span>{size.get('name')}</span>
        );
      }

    });

  });
