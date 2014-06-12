/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './InstanceSizeOption.react',
    'stores/SizeStore'
  ],
  function (React, Backbone, InstanceSizeOption, SizeStore) {

    function getState(provider, identity){
      return {
        sizes: SizeStore.get(provider.id, identity.id)
      }
    }

    return React.createClass({

      propTypes: {
        provider: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        identity: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        onChange: React.PropTypes.func.isRequired
      },

      getInitialState: function(){
        return getState(this.props.provider, this.props.identity);
      },

      componentWillReceiveProps: function (nextProps) {
        this.setState(getState(nextProps.provider, nextProps.identity));
      },

      render: function () {
        if (this.state.sizes) {
          var options = this.state.sizes.map(function (size) {
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
