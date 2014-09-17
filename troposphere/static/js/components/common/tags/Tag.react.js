/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',

    // plugins
    'bootstrap'
  ],
  function (React, Backbone) {

    return React.createClass({
      display: "Tag",

      propTypes: {
        tag: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      componentDidMount: function(){
        var el = this.getDOMNode();
        var $el = $(el);
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
