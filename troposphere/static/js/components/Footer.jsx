import React from "react";
import RaisedButton from 'material-ui/RaisedButton';
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
                <RaisedButton
                    primary
                    style={{ marginLeft: "20px" }}
                    onTouchTap={this.onFeedback}
                    label="Feedback & Support"
                />
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
            /* eslint-disable react/no-danger */
            footerContent = (<div className="container">
                <span className="footer-content"
                    dangerouslySetInnerHTML={{ __html:footerHTML }}>
                </span>
                {feedbackButton}
            </div>
            );
            /* eslint-enable react/no-danger */
        }

        return (
        <footer className="footer">
            {footerContent}
        </footer>
        );
    }

});
