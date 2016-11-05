import React, { PropTypes } from 'react';

const Code = ({ children, mb }) => {
        return (
            <div style={{
                    marginBottom: mb,
                    lineHeight: "1.5",
                    fontSize: "10px",
                    fontWeight: "100",
                    fontFamily: "Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New",
                    color: "crimson",
                    paddingRight: "3px",
                    paddingLeft: "4px", 
                    border: "solid 1px #d6d4d4",
                    display: "table",
                    background: "#efefef",
                    borderRadius: "2px",
                }}
            >
                { children }
            </div> 
        );
};

export default Code
