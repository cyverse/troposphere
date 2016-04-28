
define(
  [
    'react',
    'backbone',
    'stores'
  ],
  function (React, Backbone, stores) {

    return React.createClass({
      displayName: "Size",

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
          <span style={{textTransform: "capitalize"}}>{size.get('name')}</span>
        );
      }

    });

  });
