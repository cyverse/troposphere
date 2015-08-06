define(function (require) {

  var React = require('react'),
      stores = require('stores');

  return React.createClass({

    propTypes: {
      onChange: React.PropTypes.func.isRequired,
      imageId: React.PropTypes.number.isRequired
    },

    handleChange: function(e){
      this.props.onChange(e.target.value)
    },

    renderImage: function(image){
      return (
        <option key={image.id} value={image.id}>
          {image.get('name')}
        </option>
      )
    },

    render: function () {
      var imageId = this.props.imageId,
          username = stores.ProfileStore.get().get('username'),
          images = stores.ImageStore.fetchWhere({
            created_by__username: username
          }),
          options;

      if(!images) return <div className="loading"/>;

      options = images.map(this.renderImage);

      return (
        <div className="form-group">
          <h4 htmlFor="Image" className="control-label">Change Image</h4>
          <div className="alert alert-danger">
            <strong>Warning: </strong>
            Changing this value will move this version to a different image you own.
          </div>
          <div className="help-block">
            Select the Image that best describes this image.
          </div>
          <select value={imageId} name="Image" className="form-control" onChange={this.handleChange}>
            {options}
          </select>
        </div>
      );
    }

  });

});
