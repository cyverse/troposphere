
define(
  [
    'react',
    'backbone',
    'moment',
    './Image.react'
  ],
  function (React, Backbone, moment, Image) {

    return React.createClass({
      displayName: "ImageList",

      propTypes: {
        images: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        onClick: React.PropTypes.func
      },

      filterEndDate: function(list) {
          list = list.filter(
                  (version) => {
                      let dateNow = moment(new Date()).format();
                      let endDate = version.get('end_date')
                      if (!endDate) { return true }
                      if (endDate.format() === "Invalid date") { return true }
                      if (endDate.isAfter(dateNow)) { return true }
                      return false
                  }
              );
          return new Backbone.Collection(list);
      },

      renderImage: function (image) {
        return (
          <Image key={image.id} image={image} onSelectImage={this.props.onSelectImage}/>
        )
      },

      render: function () {
        let images = this.filterEndDate(this.props.images);
        return (
          <ul className="app-card-list modal-list">
            {images.map(this.renderImage)}
            {this.props.children}
          </ul>
        );
      }

    });
  });
