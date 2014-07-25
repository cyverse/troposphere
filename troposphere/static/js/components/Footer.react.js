/** @jsx React.DOM */

define(
  [
    'react'
  ],
  function (React) {

    return React.createClass({

      render: function () {
        var year = new Date().getFullYear();

        return (
          <footer className="footer">
            <div className="container">
              <a href="http://user.iplantcollaborative.org" target="_blank">
                    {"\u00a9" + year + " iPlant Collaborative"}
              </a>
              <button className="btn btn-default">{"Feedback & Support"}</button>
            </div>
          </footer>
        );
      }

    });

  });
