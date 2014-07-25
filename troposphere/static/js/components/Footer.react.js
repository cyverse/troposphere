/** @jsx React.DOM */

define(
  [
    'react',
    'actions/HelpActions',
    'context'
  ],
  function (React, HelpActions, context) {

    return React.createClass({

      onFeedback: function(){
        HelpActions.showFeedbackModal();
      },

      render: function () {
        var year = new Date().getFullYear();

        var feedbackButton = null;
        if(context.profile){
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
