define(function (require) {

  var React = require('react/addons'),
      ImageCard = require('../common/ImageCard.react');

  return React.createClass({
    displayName: "ImageCardGrid",

    propTypes: {
      title: React.PropTypes.string,
      images: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
      tags: React.PropTypes.instanceOf(Backbone.Collection).isRequired
    },

    renderTitle: function () {
      var title = this.props.title;
      if (!title) return;

      return (
        <h3>{title}</h3>
      )
    },

    renderCard: function(image){
      return (
        <li key={image.id}>
          <ImageCard
            image={image}
            tags={this.props.tags}/>
        </li>
      );
    },

    render: function () {
      var images = this.props.images,
        imageCards = images.map(this.renderCard);

      return (
        <div>
          {this.renderTitle()}
          <ul className='app-card-grid'>
            {imageCards}
          </ul>
        </div>
      );
    }

  });

});
