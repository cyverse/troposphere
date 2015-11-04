define(function (require) {

  var React = require('react/addons');

  var ENTER_KEY = 13;

  return React.createClass({
    displayName: "EditableInputField",

    propTypes: {
      text: React.PropTypes.string
    },

    componentDidMount: function () {
      this.getDOMNode().focus();
    },

    onDoneEditing: function (e) {
      var text = e.target.value;
      if (text.trim()) {
        this.props.onDoneEditing(text);
      } else {
        this.props.onDoneEditing(this.props.text);
      }
    },

    onEnterKey: function (e) {
      var text = e.target.value;
      if (e.which === ENTER_KEY && text.trim()) {
        this.props.onDoneEditing(text);
      }
    },

    render: function () {
      return (
        <input type="text" defaultValue={this.props.text} onBlur={this.onDoneEditing} onKeyPress={this.onEnterKey}/>
      );
    }

  });

});
