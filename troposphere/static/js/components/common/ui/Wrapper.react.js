import React from 'react';
import { marg } from 'troposphere-ui/styles';

const Wrapper = React.createClass({
    render() {
        return (
            <div
                className="container"
                style={{
                    position: "relative",
                    ...this.props.style, 
                    ...marg( this.props ),
                }}
            >
                { this.props.children }
            </div>
        )   
    }
});
 export default Wrapper
