/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/common/Time.react',
    'components/common/EditableInputField.react',
    'actions/VolumeActions'
  ],
  function (React, Backbone, Time, EditableInputField, VolumeActions) {

    return React.createClass({

      propTypes: {
        volume: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      getInitialState: function(){
        return {
          name: this.props.volume.get('name'),
          isEditing: false
        }
      },

      onEnterEditMode: function(e){
        this.setState({isEditing: true});
      },

      onDoneEditing: function(text){
        this.setState({
          name: text,
          isEditing: false
        });
        VolumeActions.updateVolumeAttributes(this.props.volume, {name: text})
      },

      onEditInformation: function(e){
        e.preventDefault();
        alert("Editing instance details not yet implemented.");
      },

      render: function () {

        var nameContent;
        if(this.state.isEditing){
          nameContent = (
            <EditableInputField text={this.state.name} onDoneEditing={this.onDoneEditing}/>
          );
        }else{
          nameContent = (
            <h4 onClick={this.onEnterEditMode}>
              {this.state.name}
              <i className="glyphicon glyphicon-pencil"></i>
            </h4>
          );
        }

        return (
          <div className="resource-info-section section clearfix">

            <div className="resource-image">
              <img src="//www.gravatar.com/avatar/918bf82f238c6c264fc7701e1ff61363?d=identicon&amp;s=113" width="113" height="113"/>
            </div>

            <div className="resource-info">
              <div className="resource-name editable">
                {nameContent}
              </div>
              <div className="resource-launch-date">
                Launched on <Time date={this.props.volume.get('start_date')}/>
              </div>
            </div>

            <div className="edit-resource-link">
              <a href="#" onClick={this.onEditInformation}>Edit Volume Info</a>
            </div>

          </div>
        );
      }

    });

  });
