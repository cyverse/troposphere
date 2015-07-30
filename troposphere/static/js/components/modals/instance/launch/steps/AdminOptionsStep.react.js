define(function (require) {

  var React = require('react'),
    Backbone = require('backbone'),
    _ = require('underscore'),
    stores = require('stores');

  return React.createClass({
    propTypes: {
      /**
       * TODO: Add 'No Deploy' Option
       * TODO: Other Admin Options?
       *
       */
      onPrevious: React.PropTypes.func.isRequired,
      onNext: React.PropTypes.func.isRequired,
      launchOptions: React.PropTypes.object.isRequired,
    },

    getInitialState: function () {
      var state = this.props.launchOptions || {};
      return state;
    },

    isSubmittable: function () {
      return true;
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

    confirm: function () {
      this.props.onNext(this.state);
    },
    renderAdminOptions: function () {
      return (<div></div>);
    },
    renderBody: function () {

      return (
        <div role='form'>

          <div className="modal-section form-horizontal">
            <h4>Instance Options</h4>

            <div className='form-group'>
              <label htmlFor='admin_options' className="col-sm-3 control-label">Admin Options</label>

              <div className="col-sm-9">
                {this.renderAdminOptions()}
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
