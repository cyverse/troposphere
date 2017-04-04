import React from "react";
import Backbone from "backbone";
import modals from "modals";
import context from "context";
import globals from "globals";


export default React.createClass({
    displayName: "Footer",

    propTypes: {
        text: React.PropTypes.string,
        link: React.PropTypes.string,
        profile: React.PropTypes.instanceOf(Backbone.Model)
    },

    onFeedback: function() {
        if (context.hasLoggedInUser()) {
            modals.HelpModals.showFeedbackModal();
        } else {
            modals.PublicModals.showPublicSupportModal();
        }
    },

    render: function() {
        var footerContent,
            year = new Date().getFullYear(),
            footerHTML = globals.SITE_FOOTER_HTML;

        var feedbackButton = null;
        if (this.props.profile) {
            feedbackButton = (
                <button className="btn btn-primary" onClick={this.onFeedback}>
                    {"Feedback & Support"}
                </button>
            );
        }

        if(!footerHTML) {
            footerContent = (
            <div className="container">
                <a href={this.props.link} target="_blank">
                    {"\u00a9" + year + " " + this.props.text}
                </a>
                {feedbackButton}
            </div>
            );
        } else {
            footerContent = (<div className="container">
                <div className="footer-content"
                    dangerouslySetInnerHTML={{ __html:footerHTML }}>
                </div>
                {feedbackButton}
            </div>
            );
        }

        return (
        <footer className="footer">
            {footerContent}
        </footer>
        );
    }

});
