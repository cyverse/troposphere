import React from 'react';
import ReactDOM from 'react-dom';
import Backbone from 'backbone';
import $ from 'jquery';
// plugin: required but not used directly
import bootstrap from 'bootstrap';

let maxDescriptionLength = 200;

export default React.createClass({
    displayName: "ImageCardDescription",

    propTypes: {
      image: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    componentDidMount: function (e) {
      var image = this.props.image,
        description = image.get('description');

      if (description.length > maxDescriptionLength) {
        var el = ReactDOM.findDOMNode(this);
        var $el = $(el);
        $el.tooltip({
          title: description
        });
      }
    },

    render: function () {
      var image = this.props.image,
        description = image.get('description');

      if(description.length > maxDescriptionLength){
        description = image.get('description').slice(0, maxDescriptionLength - 3) + "..."
      }

      return (
        <p className="description">{description}</p>
      );
    }
});
