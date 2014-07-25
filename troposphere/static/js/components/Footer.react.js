/** @jsx React.DOM */

define(
  [
    'react',
    'actions/HelpActions'
  ],
  function (React, HelpActions) {

    return React.createClass({

      onFeedback: function(){
        HelpActions.showFeedbackModal();
      },

      render: function () {
        var year = new Date().getFullYear();

        return (
          <footer className="footer">
            <div className="container">
              <a href="http://user.iplantcollaborative.org" target="_blank">
                    {"\u00a9" + year + " iPlant Collaborative"}
              </a>
              <button className="btn btn-primary" onClick={this.onFeedback}>
                {"Feedback & Support"}
              </button>
            </div>
          </footer>
        );
      }

    });

  });
