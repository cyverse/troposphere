define(function (require) {

  var React = require('react'),
      ImageListCard = require('../common/ImageListCard.react');

  return React.createClass({

    propTypes: {
      title: React.PropTypes.string,
      images: React.PropTypes.instanceOf(Backbone.Collection).isRequired
    },

    renderTitle: function(){
      var title = this.props.title;
      if(!title) return;

      return (
        <h3>{title}</h3>
      )
    },

    renderCard: function(image){
      return (
        <li key={image.id}>
          <ImageListCard image={image}/>
        </li>
      );
    },

    render: function () {
      var images = this.props.images;
      var imageCards = images.map(this.renderCard);

      return (
        <div>
          {this.renderTitle()}
          <ul className='app-card-list'>
            {imageCards}
          </ul>
        </div>
      );
    }

  });

});
