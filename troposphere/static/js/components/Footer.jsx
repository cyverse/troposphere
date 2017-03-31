import React from "react";
import RaisedButton from 'material-ui/RaisedButton';
import Backbone from "backbone";
import modals from "modals";
import context from "context";


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
        var year = new Date().getFullYear();

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

        return (
        <footer className="footer">
            <div className="container">
                <a href={this.props.link} target="_blank">
                    {"\u00a9" + year + " " + this.props.text}
                </a>
                {feedbackButton}
            </div>
        </footer>
        );
    }

});
