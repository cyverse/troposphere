/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './InstanceSizeOption.react',
    'stores/SizeStore'
  ],
  function (React, Backbone, InstanceSizeOption, SizeStore) {

//    function getState(provider, identity){
//      return {
//        sizes: SizeStore.get(provider.id, identity.id)
//      }
//    }

    return React.createClass({

      propTypes: {
        //provider: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        //identity: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        sizeId: React.PropTypes.string.isRequired,
        sizes: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        onChange: React.PropTypes.func.isRequired
      },

//      getInitialState: function(){
//        return getState(this.props.provider, this.props.identity);
//      },
//
//      componentWillReceiveProps: function (nextProps) {
//        this.setState(getState(nextProps.provider, nextProps.identity));
//      },

      render: function () {
        if (this.props.sizes) {
          var options = this.props.sizes.map(function (size) {
            return (
              <InstanceSizeOption key={size.id} size={size}/>
            );
          });

          // todo: This is bad. Because the component is being given the provider and identity
          // as properties, it has to go fetch the sizes to figure out what it should be displaying.
          // This means the parent component has no idea what size should be selected, or even what
          // the first size to default select is, so it can't pass it a sizeId as a property the first
          // time the component is initialized.  I think this is a bad inversion of control - we should
          // probably be fetching the sizes in the parent component, and pass in the list like we do
          // with the rest of the components (and setting sizeId to the first size if not in state already)
//          if(!this.props.sizeId) {
//            var target = {
//              value: this.state.sizes.first().id
//            };
//            this.props.onChange({target: target});
//          }

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
