import React from "react";

export default React.createClass({
    displayName: "MediaCard",

    render() {
        let style = this.style();
        let {
            onCardClick,
            avatar,
            title,
            subheading,
            description,
        } = this.props;

        return (
            <div
                onClick={ onCardClick }
                style={ style.card }
            >
                <div style={ style.avatar }>
                    { avatar }
                </div>
                <div style={ style.content } >
                    <div style={ style.titleSection } >
                        <h2
                            className="t-body-2"
                            style={ style.title }
                        >
                            { title }
                        </h2>
                        <div style={ style.subheading } >
                                { subheading}
                        </div>
                    </div>
                    <div style={ style.description } >
                        { description }
                    </div>
                </div>
            </div>
        );
    },

    style() {
        let cardCursor = this.props.onCardClick ?
            "pointer" : "default";
        return {
            card: {
                display: "flex",
                position: "relative",
                cursor: cardCursor,
                padding: "10px",
                boxShadow: "0 -1px 0 #e5e5e5,0 0 2px rgba(0,0,0,.12),0 2px 4px rgba(0,0,0,.24)",
                background: 'white',
            },

            avatar: {
                display: "table",
                borderRadius: "50%",
                overflow: "hidden",
                marginRight: "20px",
            },

            content: {
                display: "flex",
                flexFlow: "wrap",
                flex: "1",
            },

            titleSection: {
                minWidth: "220px",
                marginRight: "40px"
            },

            title: {
                marginBottom: "0",
            },

            subheading: {
                 fontSize: "12px",
            },

            description: {
                minWidth: "250px",
                flex: "1"
            },
        }
    },
});
