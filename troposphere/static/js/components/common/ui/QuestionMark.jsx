import React from 'react';
import Glyphicon from 'components/common/Glyphicon';
import Tooltip from 'react-tooltip';
import _ from 'underscore';

export default React.createClass({
    propTypes: {
        tip: React.PropTypes.string.isRequired
    },

    getInitialState() {
        return {
            mouseOver: false
        };
    },
    onMouseEnter() {
        this.setState({
            mouseOver: true
        });
    },
    onMouseLeave() {
        this.setState({
            mouseOver: false
        });
    },
    render() {
        let mouseOver = this.state.mouseOver;
        let opacity = mouseOver ? 1 : 0.4;
        let rand = Math.random() + "";
        let passThroughProps = _.pick(this.props, "style");

        return (
        <span { ...passThroughProps }>
            <span onMouseEnter={this.onMouseEnter}
                  onMouseLeave={this.onMouseLeave}
                  style={{ opacity }}
                  aria-hidden="true">
                <Glyphicon
                    data-tip={this.props.tip}
                    data-for={rand}
                    name="question-sign" />
            </span>
            <Tooltip id={rand} place="top" effect="solid" />
        </span>
        );
    }
});
