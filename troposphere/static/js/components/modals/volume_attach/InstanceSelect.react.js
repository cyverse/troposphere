/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './InstanceOption.react',
    'stores/SizeStore'
  ],
  function (React, Backbone, InstanceOption, SizeStore) {

    return React.createClass({

      propTypes: {
        instanceId: React.PropTypes.string.isRequired,
        instances: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        onChange: React.PropTypes.func.isRequired
      },

      render: function () {
        if (this.props.instances) {
          var options = this.props.instances.map(function (instance) {
            return (
              <InstanceOption key={instance.id} instance={instance}/>
            );
          });

          return (
            <select value={this.props.instanceId} className='form-control' id='size' onChange={this.props.onChange}>
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
