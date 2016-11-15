import React from 'react';

const Code = ({ children, ...rest }) => {
    let styles = computeStyles(rest);

    return (
        <div style={ styles.container }>
            { children }
        </div>
    );
};

const computeStyles = ({ mb }) => {
    let styles= {};
    let fontStack = [
        "Consolas",
        "Monaco",
        "Lucida Console",
        "Liberation Mono",
        "DejaVu Sans Mono",
        "Bitstream Vera Sans Mono",
        "Courier New",
    ];

    styles.container = {
        fontFamily: fontStack.join(),
        marginBottom: mb,
        lineHeight: "1.5",
        fontSize: "10px",
        fontWeight: "100",
        color: "crimson",
        paddingRight: "3px",
        paddingLeft: "4px",
        border: "solid 1px #d6d4d4",
        display: "table",
        background: "#efefef",
        borderRadius: "2px",
    };

    return styles
};

export default Code
