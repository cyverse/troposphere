import React from "react";
import ReactDOM from "react-dom";


let ENTER_KEY = 13;

export default React.createClass({
    displayName: "EditableInputField",

    propTypes: {
        text: React.PropTypes.string.isRequired,
        onChange: React.PropTypes.func,
        onDoneEditing: React.PropTypes.func,
    },

    getDefaultProps() {
        return {
           onChange: () => {},
           onDoneEditing: () => {}
        }
    },

    componentDidMount: function() {
        ReactDOM.findDOMNode(this).focus();
    },

    onDoneEditing: function(e) {
        var text = e.target.value;
        if (text.trim()) {
            this.props.onDoneEditing(text);
        } else {
            this.props.onDoneEditing(this.props.text);
        }
    },

    onEnterKey: function(e) {
        var text = e.target.value;
        if (e.which === ENTER_KEY && text.trim()) {
            this.props.onDoneEditing(text);
        }
    },

    onChange: function(e) {
        this.props.onChange(e.target.value); 
    },

    render: function() {
        const { text, errorMessage } = this.props
        const errStyle = errorMessage ? { borderColor: "#df0000" }: null;
        return (
        <div>
            <input 
                style={ errStyle }
                type="text"
                defaultValue={ text }
                onBlur={ this.onDoneEditing }
                onChange={ this.onChange }
                onKeyPress={ this.onEnterKey }
            />
            <div style={{ color: "#df0000" }}>
                { errorMessage }
            </div>
        </div>
        );
    }

});
