define(function (require) {

  var React = require('react'),
    stores = require('stores');

  return React.createClass({

    propTypes: {
      onChange: React.PropTypes.func.isRequired,
      applicationId: React.PropTypes.number.isRequired
    },

    handleChange: function (e) {
      this.props.onChange(e.target.value)
    },

    renderApplication: function (application) {
      return (
        <option key={application.id} value={application.id}>
          {application.get('name')}
        </option>
      )
    },

    render: function () {
      var applicationId = this.props.applicationId,
        username = stores.ProfileStore.get().get('username'),
        applications = stores.ApplicationStore.fetchWhere({
          created_by__username: username
        }),
        options;

      if (!applications) return <div className="loading"/>;

      options = applications.map(this.renderApplication);

      return (
        <div className="form-group">
          <label htmlFor="Application" className="control-label">Change Application</label>

          <div className="help-block">
            Select the Application that best describes this image.
          </div>
          <select value={applicationId} name="Application" className="form-control" onChange={this.handleChange}>
            {options}
          </select>
        </div>
      );
    }

  });

});
