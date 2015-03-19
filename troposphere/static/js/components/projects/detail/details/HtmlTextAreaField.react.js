define(function (require) {

  var React = require('react'),
      EditableTextAreaField = require('components/common/EditableTextAreaField.react'),
      Showdown = require('showdown');

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
      var converter = new Showdown.converter(),
          textHtml,
          titleContent;

      if(this.props.title) {
        textHtml = converter.makeHtml(this.props.title);

        if (this.props.canEditTitle && this.state.isEditing) {
          titleContent = (
            <EditableTextAreaField text={this.state.title} onDoneEditing={this.onDoneEditing}/>
          );
        } else {
          titleContent = (
            <div onClick={this.onEnterEditMode}>
              <span className="html-wrapper" dangerouslySetInnerHTML={{__html: textHtml}}/>
              <i className="glyphicon glyphicon-pencil"></i>
            </div>
          );
        }
      }else{
        titleContent = null;
      }

      var titleClassName = "project-property col-md-9";
      if(this.props.canEditTitle) titleClassName += " editable";

      return (
        <div className={titleClassName}>
          {titleContent}
        </div>
      );
    }

  });

});
