import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

export default React.createClass({
    displayName: "EditableTextAreaField",

    propTypes: {
      onDoneEditing: React.PropTypes.func,
      text: React.PropTypes.string,
    },

    componentDidMount: function () {
      ReactDOM.findDOMNode(this).focus();
    },

    onDoneEditing: function (e) {
      var text = $(ReactDOM.findDOMNode(this)).find("textarea")[0].value;
      if (text.trim()) {
        this.props.onDoneEditing(text);
      } else {
        this.props.onDoneEditing(this.props.text);
      }
    },

    render: function () {
      return (
        <div>
          <textarea type="text" defaultValue={this.props.text}/>
          <button className="btn btn-small btn-default"
                  style={{"display": "block", "padding":"5px 10px"}}
                  onClick={this.onDoneEditing}>
            Save changes
          </button>
        </div>
      );
    }
});
