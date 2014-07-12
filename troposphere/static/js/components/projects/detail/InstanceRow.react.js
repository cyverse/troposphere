/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'url',
    './Checkbox.react'
  ],
  function (React, Backbone, URL, Checkbox) {

    return React.createClass({

      propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      getInitialState: function(){
        return {
          isChecked: false
        }
      },

      toggleCheckbox: function(e){
        console.log("clicked!");
        this.setState({isChecked: !this.state.isChecked});
      },

      render: function () {
        var instance = this.props.instance;
        var instanceUrl = URL.projectInstance({
          project: this.props.project,
          instance: instance
        }, {absolute: true});
        return (
          <tr>
            <td><Checkbox isChecked={this.state.isChecked} onToggleChecked={this.toggleCheckbox}/></td>
            <td><a href={instanceUrl}>{instance.get('name')}</a></td>
            <td>{instance.get('status')}</td>
            <td>{instance.get('ip_address')}</td>
            <td>?tiny1?</td>
            <td><a href="#">?iPlant Cloud - Tucson?</a></td>
          </tr>
        );
      }

    });

  });
