define(function (require) {

  var React = require('react/addons'),
    Backbone = require('backbone'),
    modals = require('modals'),
    actions = require('actions'),
    context = require('context');

  return React.createClass({
    displayName: "Footer",

    propTypes: {
      profile: React.PropTypes.instanceOf(Backbone.Model)
    },

    onFeedback: function () {
        if (context.hasLoggedInUser()) {
            modals.HelpModals.showFeedbackModal();
        } else {
            modals.PublicModals.showPublicSupportModal();
        }
    },

    render: function () {
      var year = new Date().getFullYear();

      var feedbackButton = null;
      if (this.props.profile) {
        feedbackButton = (
          <button className="btn btn-primary" onClick={this.onFeedback}>
            {"Feedback & Support"}
          </button>
        );
      }

      return (
        <footer className="footer">
          <div className="container">
            <a href="http://jetstream-cloud.org/" target="_blank">
                  {"\u00a9" + year + " " + this.props.text}
            </a>
            {feedbackButton}
          </div>
        </footer>
      );
    }

  });

});
