import React from 'react';
import GlyphiconTooltip from 'components/common/ui/GlyphiconTooltip';

export default React.createClass({
    propTypes: {
        tip: React.PropTypes.string.isRequired
    },
    render() {
        return (
            <GlyphiconTooltip tip={this.props.tip} glyphicon="question-sign" />
        );
    }
});
