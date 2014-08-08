/** @jsx React.DOM */

define(
  [
    'react',
    'backbone'
  ],
  function (React, Backbone) {

    return React.createClass({

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
