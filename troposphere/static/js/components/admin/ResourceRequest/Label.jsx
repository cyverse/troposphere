import React from "react";

const Label = React.createClass({
    render() {
        let style = Object.assign({
            margin: "7px 0px"
        }, this.props.style);

        let props = Object.assign({}, this.props, {
            style
        });

        return (
        <label { ...props }></label>
        );
    }
});

export default Label;
