/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './Provider.react'
  ],
  function (React, Backbone, Provider) {

    return React.createClass({

      propTypes: {
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      getInitialState: function(){
        return {
          selectedProvider: null
        }
      },

      handleProviderSelected: function(provider){
        this.setState({selectedProvider: provider})
      },

      renderProvider: function(provider){
        var selectedProvider = this.state.selectedProvider || this.props.providers.first(),
            isSelected = provider.id === selectedProvider.id;

        return (
          <Provider key={provider.id}
                    provider={provider}
                    isSelected={isSelected}
                    onSelected={this.handleProviderSelected}
          />
        )
      },

      render: function () {
        var providers = this.props.providers;

        return (
          <ul className="nav nav-stacked provider-list">
            {providers.map(this.renderProvider)}
          </ul>
        );

      }

    });

  });
