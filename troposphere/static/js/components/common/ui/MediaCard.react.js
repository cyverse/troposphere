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
            summary,
            detail,
        } = this.props;

        return (
            <div
                className="MediaCard"
                style={ style.card }
            >   
                <div    
                    className="MediaCard_header"
                    style={ style.header }
                    onClick={ onCardClick }
                >
                    <div style={ style.avatar }>
                        { avatar }
                    </div>
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
                    <div 
                        className="MediaCard_summary" 
                        style={ style.summary } 
                    >
                        { summary }
                    </div>
                </div>
                <div
                    className="MediaCard_description"
                    style={ style.description } 
                >
                    { detail }
                </div>
            </div>
        );
    },

    style() {
        
        let { onCardClick, isOpen } = this.props;
        let styles = {};

        // card
        let cardMargin;
        if (isOpen) {
            cardMargin = {
                marginTop: "20px",
                marginBottom: "20px",
            };
        }
        styles.card = {
            position: "relative",
            padding: "10px",
            boxShadow: "0 -1px 0 #e5e5e5,0 0 2px rgba(0,0,0,.12), 0 2px 4px rgba(0,0,0,.24)",
            background: 'white',
            ...cardMargin,
        }; 

        // header
        let openHeader = isOpen 
            ? { 
                paddingBottom: "10px",
                borderBottom: "solid 1px #EFEFEF",
                marginBottom: "20px"
            } : {};

        let headerCursor = onCardClick 
            ? "pointer" : "default";

        styles.header = {
            display: "flex",
            flexWrap: "wrap",
            cursor: headerCursor,
            ...openHeader
        };

        // avitar
        styles.avatar = {
            display: "table",
            borderRadius: "50%",
            overflow: "hidden",
            marginRight: "20px",
        };

        // title section
        styles.titleSection = {
            minWidth: "200px",
            marginRight: "40px"
        };

        // title
        styles.title = {
            marginBottom: "0",
        };

        // subheading
        styles.subheading = {
             fontSize: "12px",
        };

        // summary
        let sumDisplay = isOpen 
            ? "none" : "block";

        styles.summary = {
            flex: "1",
            width: "100%",
            paddingRight: "35px",
            display: sumDisplay 
        };
        
        // description
        let descDisplay = isOpen 
            ? "block" : "none";

        styles.description = {
            display: descDisplay
        };
       
        return styles
    },
});
