/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/common/Time.react',
    'components/common/EditableInputField.react',
    'actions/VolumeActions',
    'stores',
    'crypto',
    'components/common/Gravatar.react'
  ],
  function (React, Backbone, Time, EditableInputField, VolumeActions, stores, CryptoJS, Gravatar) {

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

        var instanceHash = CryptoJS.MD5(this.props.volume.id.toString()).toString();
        var type = stores.ProfileStore.get().get('icon_set');
        var iconSize = 113;

        return (
          <div className="resource-info-section section clearfix">

            <div className="resource-image">
              <Gravatar hash={instanceHash} size={iconSize} type={type}/>
            </div>

            <div className="resource-info">
              <div className="resource-name editable">
                {nameContent}
              </div>
              <div className="resource-launch-date">
                Launched on <Time date={this.props.volume.get('start_date')}/>
              </div>
            </div>

          </div>
        );
      }

    });

  });
