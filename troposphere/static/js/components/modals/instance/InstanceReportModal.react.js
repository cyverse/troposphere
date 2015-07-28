
define(
  [
    'react',
    'components/mixins/BootstrapModalMixin.react',
    'components/common/Glyphicon.react'
  ],
  function (React, BootstrapModalMixin, Glyphicon) {
    var _ = require("underscore");

    return React.createClass({
      mixins: [BootstrapModalMixin],

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

      isSubmittable: function () {
        var hasDetails = !!this.state.details && this.state.details.length > 0;
        return hasDetails;
      },

      getReportInfo: function () {
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

        var reportInfo = {
          problems: problems,
          details: this.state.details
        };

        return reportInfo;
      },

      //
      // Internal Modal Callbacks
      // ------------------------
      //

      cancel: function () {
        this.hide();
      },

      confirm: function () {
        this.hide();
        var reportInfo = this.getReportInfo();
        this.props.onConfirm(reportInfo);
      },

      //
      // Custom Modal Callbacks
      // ----------------------
      //

      updateCheckbox: function (key, e) {
        var state = {};
        state[key] = e.target.checked;
        this.setState(state);
      },

      handleDetailsChange: function (e) {
        this.setState({details: e.target.value});
      },

      //
      // Render
      // ------
      //

      problemText: {
        ssh: "I cannot connect via SSH.",
        vnc: "I cannot connect via VNC.",
        pending: "The instance's status never changed from pending to running",
        installErrors: "I am receiving errors while trying to run or install software",
        metrics: "The instance's metrics do not display.",
        other: "Other problem(s)."
      },

      renderCheckbox: function (value) {
        var onChange = _.partial(this.updateCheckbox, value);

        return (
          <div className="checkbox">
            <label>
              <input type="checkbox"
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

      renderIntroduction: function (instance) {
        return (
          <p className="alert alert-info">
            <Glyphicon name="info-sign"/>
            {" Is the instance "}
            <code>{this.props.instance.get('name')}</code>
            {" exhibiting unexpected behavior? Please read about "}
            <a href="https://pods.iplantcollaborative.org/wiki/x/Blm">using instances</a>
            {" or "}
            <a href="https://pods.iplantcollaborative.org/wiki/x/p55y">troubleshooting instances</a>
            {" for answers to common problems before submitting a request to support staff."}
          </p>
        );
      },

      renderBody: function () {
        var volume = this.props.volume;

        return (
          <div>
            {this.renderIntroduction(volume)}
            <div role="form">

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
                <textarea className="form-control" onChange={this.handleDetailsChange} rows="6"/>
              </div>
            </div>
          </div>
        );
      },

      render: function () {

        return (
          <div className="modal fade">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  {this.renderCloseButton()}
                  <strong>Report Instance</strong>
                </div>
                <div className="modal-body">
                  {this.renderBody()}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-danger" onClick={this.cancel}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-primary" onClick={this.confirm}
                          disabled={!this.isSubmittable()}>
                    Report Instance
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }

    });

  });
