define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      $ = require('jquery'),
      // plugin: required but not used directly
      bootstrap = require('bootstrap');

  var maxDescriptionLength = 200;

  return React.createClass({

    propTypes: {
      image: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    componentDidMount: function (e) {
      var image = this.props.image,
          description = image.get('description');

      if(description.length > maxDescriptionLength){
        var el = this.getDOMNode();
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

});
