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
        volume: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        onResourceSelected: React.PropTypes.func.isRequired
      },

      getInitialState: function(){
        return {
          isChecked: false
        }
      },

      toggleCheckbox: function(e){
        this.setState({isChecked: !this.state.isChecked});
        this.props.onResourceSelected(this.props.volume);
      },

      render: function () {
        var volume = this.props.volume;
        var volumeUrl = URL.projectVolume({
          project: this.props.project,
          volume: volume
        }, {absolute: true});

        return (
          <tr>
            <td><Checkbox isChecked={this.state.isChecked} onToggleChecked={this.toggleCheckbox}/></td>
            <td><a href={volumeUrl}>{volume.get('name')}</a></td>
            <td>Attached to <a href="#">?iPlant Base Instance?</a></td>
            <td>{volume.get('size') + " GB"}</td>
            <td><a href="#">?iPlant Cloud - Tucson?</a></td>
          </tr>
        );
      }

    });

  });
