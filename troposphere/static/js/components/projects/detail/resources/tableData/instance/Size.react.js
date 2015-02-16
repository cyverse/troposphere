/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'stores/SizeStore'
  ],
  function (React, Backbone, SizeStore) {

    return React.createClass({

      propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        var identity = this.props.instance.get('identity');
        var providerId = identity.provider;
        var identityId = identity.id;
        var sizes = SizeStore.getAllFor(providerId, identityId);

        if(sizes) {
          var sizeId = this.props.instance.get('size_alias');
          var size = sizes.get(sizeId);
          if(size) {
            return (
              <span>{size.get('name')}</span>
            );
          }else{
            return (
              <span></span>
            )
          }
        }

        return (
          <div className="loading-tiny-inline"></div>
        );
      }

    });

  });
