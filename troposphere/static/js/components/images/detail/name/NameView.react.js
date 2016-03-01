import React from 'react';
import Backbone from 'backbone';
import Showdown from 'showdown';

export default React.createClass({
      displayName: "NameView",

      propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        var image = this.props.image;

        return (
          <div className="image-info-segment row">
            <h4 className="t-title col-md-2">Name:</h4>
            <p className="content col-md-10">{image.get('name')}</p>
          </div>
        );
      }
});
