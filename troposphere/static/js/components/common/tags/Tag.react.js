define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      // plugin: required but not used directly
      bootstrap = require('bootstrap');

  return React.createClass({
    display: "Tag",

    propTypes: {
      tag: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    componentDidMount: function(){
      var el = this.getDOMNode(),
          $el = $(el);

      $el.tooltip({
        title: this.props.tag.get('description')
      });
    },

    render: function () {
      return (
        <li className="tag">
          <a href="#">{this.props.tag.get('name')}</a>
        </li>
      );

    }

  });

});
