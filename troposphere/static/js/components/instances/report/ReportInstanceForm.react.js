/** @jsx React.DOM */

define(
  [
    "react",
    "underscore"
  ],
  function (React, _) {

    return React.createClass({

      getInitialState: function () {
        return {
          ssh: false,
          vnc: false,
          pending: false,
          installErrors: false,
          metrics: false,
          other: false,
          details: ""
        };
      },

      updateCheckbox: function (key, e) {
        var state = {};
        state[key] = e.target.checked;
        this.setState(state);
      },

      updateDetails: function (e) {
        this.setState({details: e.target.value});
      },

      renderCheckbox: function (value) {
        var onChange = _.partial(this.updateCheckbox, value);

        return (
          <div className="checkbox">
            <label>
              <input
              type="checkbox"
              name="problems"
              id={"problems-" + value}
              value={value}
              checked={this.state[value]}
              onChange={onChange}
              />
              {this.problemText[value]}
            </label>
          </div>
          );
      },

      handleSubmit: function (e) {
        e.preventDefault();
        var problemKeys = _.keys(
          _.object(
            _.filter(
              _.pairs(this.state), function (pair) {
                return pair[1] === true;
              }
            )
          )
        );
        var problems = _.values(
          _.pick(this.problemText, problemKeys)
        );
      },

      problemText: {
        ssh: "I cannot connect via SSH.",
        vnc: "I cannot connect via VNC.",
        pending: "The instance's status never changed from pending to running",
        installErrors: "I am receiving errors while trying to run or install software",
        metrics: "The instance's metrics do not display.",
        other: "Other problem(s)."
      },

      render: function () {
        return (
          <form role="form" onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label>{"What problems are you having with this instance?"}</label>
              {this.renderCheckbox("ssh")}
              {this.renderCheckbox("vnc")}
              {this.renderCheckbox("pending")}
              {this.renderCheckbox("installErrors")}
              {this.renderCheckbox("metrics")}
              {this.renderCheckbox("other")}
            </div>
            <div className="form-group">
              <label htmlFor="details">
              Please provide as many details about the problem as possible.
              </label>
              <textarea className="form-control" onChange={this.updateDetails} rows="6"/>
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
          );
      }
    });

  });
