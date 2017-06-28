import React from 'react';
import GlyphiconTooltip from 'components/common/ui/GlyphiconTooltip';

export default React.createClass({
    propTypes: {
        tip: React.PropTypes.string.isRequired
    },
    render() {
        let props = Object.assign({}, this.props, {
            // Extend props with question-sign
            glyphicon: "question-sign"
        })
        return (
            <GlyphiconTooltip {...props}/>
        );
    }
});
