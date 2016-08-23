import React from 'react';
import Backbone from 'backbone';
import ImageCard from '../common/ImageCard.react';
import { filterEndDate } from 'utilities/filterCollection';


export default React.createClass({
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
      let isEndDated = !filterEndDate(image);
      return (
        <li key={image.id}>
          <ImageCard
            isEndDated={isEndDated}
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
