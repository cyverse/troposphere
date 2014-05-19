/** @jsx React.DOM */

define(
  [
    "react",
    "controllers/notifications"
  ],
  function (React, Notifications) {

    var notifications = Notifications.collection;

    // Number of milliseconds to display a notification
    var timeout = 10 * 1000;

    return React.createClass({

      getInitialState: function () {
        return {model: null};
      },

      componentDidMount: function () {
        notifications.bind('add', function (model) {
          this.setState({model: model});
        }, this);
      },

      closeNotification: function () {
        this.setState({model: null});
      },

      render: function () {
        var content = [],
            innerHtml;

        if (this.state.model) {
          innerHtml = {"__html": this.state.model.get("body")};
          content = (
            <div className={"alert alert-" + this.state.model.get("type")}>
              <button className="close" onClick={this.closeNotification}>
                {"\u00d7"}
              </button>
              <strong>{this.state.model.get("header")}</strong>
              {" "}
              <span dangerouslySetInnerHTML={innerHtml}></span>
            </div>
          );
        }

        return (
          <div id="notifications">
            {content}
          </div>
          );
      },

      componentDidUpdate: function (prevProps, prevState, root) {
        if (!this.state.model) return;
        if (!this.state.model.get('sticky')) {
          setTimeout(function () {
            this.setState({model: null});
          }.bind(this), timeout);
        }
      }

    });

  });
