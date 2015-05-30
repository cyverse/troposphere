define(function (require) {

  var React = require('react');

  return React.createClass({

    propTypes: {
      onChange: React.PropTypes.func.isRequired,
      value: React.PropTypes.string.isRequired
    },

    onChange: function (e) {
      this.props.onChange(e.target.value);
    },

    render: function () {
      return (
        <div className="form-group">
          <label htmlFor="vis" className="control-label">Image Visibility</label>
          <div className="help-block" id="vis_help">
            A VM image can be made visible to you, a select group of users or to
            everyone. If you want visibility restricted to a select group of users, provide us a list of iPlant
            usernames. Public visibility means that any user will be able to launch the instance.
          </div>
          <select value={this.props.value} name="visibility" className="form-control" onChange={this.onChange}>
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="select">Specific Users</option>
          </select>
        </div>
      );
    }

  });

});
