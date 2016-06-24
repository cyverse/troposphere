import React from 'react';
import stores from 'stores';


export default React.createClass({
    displayName: "ImageSelect",

    propTypes: {
      onChange: React.PropTypes.func.isRequired,
      imageId: React.PropTypes.number.isRequired
    },

    handleChange: function(e){
      let image_id = e.target.value,
          images = this.getUserImages(),
          image = images.get(image_id);
      this.props.onChange(image);
    },

    getUserImages: function() {
      let username = stores.ProfileStore.get().get('username'),
          images = stores.ImageStore.fetchWhere({
              created_by__username: username
          });
      return images;
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
          images = this.getUserImages(),
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
