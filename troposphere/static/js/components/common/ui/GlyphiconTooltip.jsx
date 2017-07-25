import React from 'react';
import Glyphicon from 'components/common/Glyphicon';
import Tooltip from 'react-tooltip';
import _ from 'underscore';

export default React.createClass({
    displayName: "GlyphiconTooltip",

    propTypes: {
        tip: React.PropTypes.string.isRequired,
        glyphicon: React.PropTypes.string.isRequired,
        position: React.PropTypes.string
    },
    getDefaultProps: function() {
        return {
            position: "top",
        }
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
                    name={this.props.glyphicon} />
            </span>
            <Tooltip id={rand} place={this.props.position} effect="solid" />
        </span>
        );
    }
});
