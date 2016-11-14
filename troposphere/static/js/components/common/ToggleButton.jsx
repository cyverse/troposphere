import React from 'react';
import tinyColor from 'tinycolor2'

export default React.createClass({
    displayName: "ToggleButton",

    propTypes: {
        //Nothing is required here.
        enabled_text: React.PropTypes.string,
        disabled_text: React.PropTypes.string,
        isEnabled: React.PropTypes.bool,
        onToggle: React.PropTypes.func.isRequired,
    },

    getInitialState() {
        return {
            isEnabled: this.props.isEnabled || false,
        };
    },

    getDefaultProps() {
        return {
            enabled_text: "True",
            disabled_text: "False"
        };
    },

    onToggle(e) {

        let isEnabled = this.state.isEnabled ? false : true;
        this.setState({
            isEnabled
        });
        return this.props.onToggle(isEnabled, e);
    },

    render() {
        let { enabled_text, disabled_text } = this.props;
        let styles = this.styles();
        let text = this.state.isEnabled
            ? enabled_text
            : disabled_text;

        return (
        <div style={ styles.toggleWrapper } onClick={ this.onToggle} >
            <div style={ styles.toggleSwitch } />
            <div style={ styles.toggleBackground }>
                <div style={ styles.toggleText }>
                    { text }
                </div>
            </div>
        </div>
        );
    },

    styles() {

        let isEnabled = this.state.isEnabled;

        let enabledColor = "#eb6538";
        let disabledColor = "#dbdbdb";

        let style = {};

        style.toggleWrapper = {
            cursor: "pointer",
            position: "relative",
            paddingTop: "1px",
            width: "120px",
        };

        let toggleBGColor = isEnabled
            ? tinyColor(enabledColor).lighten(10)
            : tinyColor(disabledColor).lighten(10);

        style.toggleBackground = {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "inset 1px 1px 1px rgba(0,0,0,.1), 0px 0px 1px white",
            height: "20px",
            borderRadius: "900px",
            backgroundColor: toggleBGColor,
            transition: "background-color ease .2s",
        };

        let textColor = isEnabled
            ? "white" : "black";

        style.toggleText = {
            textAlign: "center",
            color: textColor,
            fontWeight: "100",
            fontSize: "12px",
        };

        let switchBGColor = isEnabled
            ? enabledColor
            : disabledColor;

        let switchPosition = isEnabled
        ? { right: "0"} : { right: "calc(100% - 22px)" };

        style.toggleSwitch = {
            ...switchPosition,
            top: -1,
            width: "22px",
            height: "22px",
            position: "absolute",
            backgroundColor: switchBGColor,
            borderRadius: "12px",
            boxShadow: "0px 1px 1px 0px rgba(0,0,0,.3)",
            transition: "right ease .1s"
        };

        return style
    }
});
