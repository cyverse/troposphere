/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'actions'
  ],
  function (React, Backbone, actions) {

    return React.createClass({

      propTypes: {
        profile: React.PropTypes.instanceOf(Backbone.Model)
      },

      onFeedback: function(){
        actions.HelpActions.showFeedbackModal();
      },

      render: function () {
        var year = new Date().getFullYear();

        var feedbackButton = null;
        if(this.props.profile){
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
                    {"\u00a9" + year + " iPlant Collaborative"}
              </a>
              {feedbackButton}
            </div>
          </footer>
        );
      }

    });

  });
