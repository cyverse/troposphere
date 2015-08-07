define(function (require) {

  var React = require('react'),
    Backbone = require('backbone'),
    _ = require('underscore'),
    stores = require('stores');

  return React.createClass({
    propTypes: {
      /**
       * TODO: Add Boot scripts
       * TODO: Other user options?
       *
       */
      launchOptions: React.PropTypes.object.isRequired,
      onPrevious: React.PropTypes.func.isRequired,
      onNext: React.PropTypes.func.isRequired
    },

    getInitialState: function () {
      var state = this.props.launchOptions || {};
      return state;
    },

    isSubmittable: function () {
      return true;
    },
    confirm: function () {
      this.props.onNext(this.state);
    },
    componentDidMount: function () {
    },

    componentWillUnmount: function () {
    },

    //
    // Internal Modal Callbacks
    // ------------------------
    //

    cancel: function () {
      this.props.onPrevious(this.state);
    },

    renderBootScriptsForm: function () {
      return (<div></div>);
    },
    renderBody: function () {

      return (
        <div role='form'>

          <div className="modal-section form-horizontal">
            <h4>Instance Options</h4>

            <div className='form-group'>
              <label htmlFor='boot_scripts' className="col-sm-3 control-label">Boot Scripts</label>

              <div className="col-sm-9">
                {this.renderBootScriptForm()}
              </div>
            </div>
          </div>
        </div>
      );
    },
    render: function () {

      return (
        <div>
          {this.renderBody()}
          <div className="modal-footer">
            <button type="button" className="btn btn-default pull-left" onClick={this.cancel}>
              <span className="glyphicon glyphicon-chevron-left"></span>
              Back
            </button>
            <button type="button" className="btn btn-primary" onClick={this.confirm} disabled={!this.isSubmittable()}>
              Continue
            </button>
          </div>

        </div>
      );
    }

  });

});
