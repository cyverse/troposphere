/** @jsx React.DOM */

define(
  [
    'react',
    'backbone'
  ],
  function (React, Backbone) {

    return React.createClass({

      propTypes: {
        provider: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        isSelected: React.PropTypes.bool.isRequired,
        onSelected: React.PropTypes.func.isRequired
      },

      handleProviderSelected: function(){
        this.props.onSelected(this.props.provider);
      },

      render: function(){
        var provider = this.props.provider,
            classNames = this.props.isSelected ? "active" : null;

        return (
          <li className={classNames} onClick={this.handleProviderSelected}>
            <a>{provider.get('name')}</a>
          </li>
        )
      }

    });

  });
