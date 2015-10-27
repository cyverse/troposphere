define(function (require) {

  var React = require('react/addons'),
    EditableTextAreaField = require('components/common/EditableTextAreaField.react');

  return React.createClass({
    displayName: "TextAreaField",

    propTypes: {
      title: React.PropTypes.string,
      canEditTitle: React.PropTypes.bool,
      onTitleChanged: React.PropTypes.func
    },

    getInitialState: function () {
      return {
        isEditing: false,
        title: this.props.title
      }
    },

    onDoneEditing: function (text) {
      this.setState({
        title: text,
        isEditing: false
      });
      this.props.onTitleChanged(text);
    },

    onEnterEditMode: function (e) {
      this.setState({isEditing: true});
    },

    render: function () {

      var titleContent;
      if (this.props.title) {
        if (this.props.canEditTitle && this.state.isEditing) {
          titleContent = (
            <EditableTextAreaField text={this.state.title} onDoneEditing={this.onDoneEditing}/>
          );
        } else {
          titleContent = (
            <p onClick={this.onEnterEditMode}>
              {this.state.title}
              <i className="glyphicon glyphicon-pencil"></i>
            </p>
          );
        }
      } else {
        titleContent = null;
      }

      var titleClassName = "project-property col-md-9";
      if (this.props.canEditTitle) titleClassName += " editable";

      return (
        <div className={titleClassName}>
          {titleContent}
        </div>
      );
    }

  });

});
