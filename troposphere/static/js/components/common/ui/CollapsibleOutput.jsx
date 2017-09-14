import { ShowMoreEllipsis } from "cyverse-ui";
import { marg } from "cyverse-ui/styles";
import React from "react";

/**
 * A consistently styled `<code/>` element
 *
 * This will likely be redefined within CyVerse-UI. When that
 * happened, this can be replaced w/ the official version.
 */
const Code = (props) => {
    // FIXME: don't hardcode these:
    // - `style.color`
    // -color in `style.borderLeft`
    let text = props.text || "",
        style = {
            display: "block",
            whiteSpace: "pre-wrap",
            padding: "20px",
            color: "rgba(0, 0, 0, 0.54)",
            fontSize: "14px",
            borderLeft: `solid rgba(0, 0, 0, 0.54) 5px`,
            background: "rgba(0,0,0,0.03)",
            ...marg(props)
        };

    return (
        <pre style={style}>
            {text}
        </pre>
    );
}

/**
 * Allow a region to be collapsed and expanded to avoid
 * over-powering the containing context.
 *
 * This is a candidate for extract into a common Troposphere component,
 * or for wider review and inclusion in CyVerse-UI. For now, it begins
 * life as a "hopefully" useful component within Admin.
 */
const CollapsibleOutput = React.createClass({
    propTypes: {
        output: React.PropTypes.string
    },

    getInitialState() {
        return {
            open: false
        };
    },

    onEllipsisClick() {
        this.setState({
            open: !this.state.open
        });
    },

    render() {
        let { open } = this.state,
            { output } = this.props,
            content = null,
            partial = output
                    ? output.substring(0, 32) : '***';

        if (!open) {
            content = (
                <span onClick={this.onEllipsisClick}>
                    {` ${partial} `}
                    <ShowMoreEllipsis  />
                </span>
            );
        } else {
            content = (
                <span onClick={this.onEllipsisClick}>
                    <ShowMoreEllipsis  />
                    <Code text={output} />
                </span>
            );
        }

        return (
            <div style={{display: "inline-block"}}>
                    {content}
            </div>
        );
    }
});



export default CollapsibleOutput;
