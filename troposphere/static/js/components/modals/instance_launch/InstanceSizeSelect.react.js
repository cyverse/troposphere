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
        sizeId: React.PropTypes.string.isRequired,
        sizes: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        onChange: React.PropTypes.func.isRequired
      },

      render: function () {
        if (this.props.sizes) {
          var options = this.props.sizes.map(function (size) {
            return (
              <InstanceSizeOption key={size.id} size={size}/>
            );
          });

          return (
            <select value={this.props.sizeId} className='form-control' id='size' onChange={this.props.onChange}>
              {options}
            </select>
          );
        } else {
          return (
            <div className="loading-small"></div>
          );
        }
      }
    });

  });
