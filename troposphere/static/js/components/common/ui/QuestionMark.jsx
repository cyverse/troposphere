import React from 'react';
import Tooltip from 'react-tooltip';

export default React.createClass({
    getInitialState() {
        return {
            opacity: "0.4",
        };
    },
    onMouseOver() {
        this.setState({
            opacity: "1"
        });
    },
    onMouseOut() {
        this.setState(this.getInitialState());
    },
    render() {
        let opacity = this.props.tip ? this.state.opacity : "0";
        let rand = Math.random() + "";
        return (
        <span><span onMouseOver={this.onMouseOver}
                  onMouseOut={this.onMouseOut}
                  style={{ opacity }}
                  data-tip={this.props.tip}
                  data-for={rand}
                  className="glyphicon glyphicon-question-sign"
                  aria-hidden="true"></span>
        <Tooltip id={rand} place="right" effect="solid" />
        </span>
        );
    }
});
