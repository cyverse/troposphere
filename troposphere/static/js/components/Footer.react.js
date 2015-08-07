define(function (require) {

  var React = require('react'),
    Backbone = require('backbone'),
    modals = require('modals'),
    actions = require('actions');

  return React.createClass({

    propTypes: {
      profile: React.PropTypes.instanceOf(Backbone.Model)
    },

    onFeedback: function () {
      modals.HelpModals.showFeedbackModal();
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
            <a href="http://user.iplantcollaborative.org" target="_blank">
                  {"\u00a9" + year + " " + this.props.text}
            </a>
            {feedbackButton}
          </div>
        </footer>
      );
    }

  });

});
