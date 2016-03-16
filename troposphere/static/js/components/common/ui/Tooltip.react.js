import React from 'react';

export default React.createClass({
    propTypes: {
        message: React.PropTypes.string.isRequired,
    },

    style: {
        content: {
            position: "absolute",
            bottom: "50px",
            width: "200px",
            padding: "10px",
            background: "black",
            boxShadow: "0px 2px 5px 0px rgba(0,0,0,.6)",
            borderRadius: "3px",
            color: "white",
            textAlign: "center",

        },
        originPoint: {
            position: "absolute",
            right: "0",
            left: "0",
            bottom: "-20px",
            margin:"auto",
            width: "10px",
            border: "solid 10px rgba(0,0,0,0)",
            borderTop: "solid 10px black",
        },
    },

    render: function() {
        return (
            <div style={this.style.content} >
                <div>
                    {this.props.message}
                </div>
                <div style={this.style.originPoint}/>
            </div>
        )
    }
})
