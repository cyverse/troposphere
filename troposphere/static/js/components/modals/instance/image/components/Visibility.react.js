define(function (require) {

  var React = require('react/addons');

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

          <div className="help-block">
            <p>Please select the level of visibility this image should have.</p>

            <p>
              <em>Public - </em>
              {
                " The image will be visible to all users and anyone will be able to launch it."
              }
            </p>

            <p>
              <em>Private - </em>
              {
                " The image will be visible only to you and only you will be able to launch it."
              }
            </p>

            <p>
              <em>Specific Users - </em>
              {
                " The image will be visible to only you and the users you specify, and only you and those users will be able to launch it."
              }
            </p>
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
