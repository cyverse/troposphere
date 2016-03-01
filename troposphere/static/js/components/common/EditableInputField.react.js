import React from 'react';
import ReactDOM from 'react-dom';

let ENTER_KEY = 13;

export default React.createClass({
    displayName: "EditableInputField",

    propTypes: {
      text: React.PropTypes.string
    },

    componentDidMount: function () {
      ReactDOM.findDOMNode(this).focus();
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
