/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/common/EditableInputField.react'
  ],
  function (React, Backbone, EditableInputField) {

    var ENTER_KEY = 13;

    return React.createClass({

      propTypes: {
        title: React.PropTypes.string,
        canEditTitle: React.PropTypes.bool,
        onTitleChanged: React.PropTypes.func
      },

      getInitialState: function(){
        return {
          isEditing: false,
          title: this.props.title
        }
      },

      onDoneEditing: function(text){
        this.setState({
          title: text,
          isEditing: false
        });
        this.props.onTitleChanged(text);
      },

      onEnterEditMode: function(e){
        this.setState({isEditing: true});
      },

      render: function () {

        var titleContent;
        if(this.props.title) {
          if (this.props.canEditTitle && this.state.isEditing) {
            titleContent = (
              <EditableInputField text={this.state.title} onDoneEditing={this.onDoneEditing}/>
              );
          } else {
            titleContent = (
              <p onClick={this.onEnterEditMode}>
                {this.state.title}
                <i className="glyphicon glyphicon-pencil"></i>
              </p>
            );
          }
        }else{
          titleContent = null;
        }

        var titleClassName = "project-property col-md-9";
        if(this.props.canEditTitle) titleClassName += " editable";

        var hasAdditionalContent = this.props.additionalContent;

        return (
          <div className={titleClassName}>
            {titleContent}
          </div>
        );
      }

    });

  });
