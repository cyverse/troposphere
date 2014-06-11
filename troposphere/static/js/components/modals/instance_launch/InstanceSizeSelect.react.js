/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './InstanceSizeOption.react'
  ],
  function (React, Backbone, InstanceSizeOption) {

    return React.createClass({

      propTypes: {
        sizes: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        onChange: React.PropTypes.func.isRequired
      },

      render: function () {
        var options = [];
        if (this.props.sizes) {
          options = this.props.sizes.map(function (size) {
            return (
              <InstanceSizeOption key={size.id} size={size}/>
            );
          });
        }

        return (
          <select value={this.props.sizeId} className='form-control' id='size' onChange={this.props.onChange}>
            {options}
          </select>
        );
      }
    });

  });
