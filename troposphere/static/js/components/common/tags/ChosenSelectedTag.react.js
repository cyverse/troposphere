/** @jsx React.DOM */

define(
  [
    'react',
    'backbone'
  ],
  function (React, Backbone) {

    return React.createClass({
      display: "ChosenDropdownItem",

      propTypes: {
        tag: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        onRemoveTag: React.PropTypes.func.isRequired
      },

      onRemoveTag: function(){
        this.props.onRemoveTag(this.props.tag);
      },

      render: function () {
        var tag = this.props.tag;

        return (
          <li className="search-choice">
            <span>{tag.get('name')}</span>
            <a className="search-choice-close" onClick={this.onRemoveTag}></a>
          </li>
        );
      }

    });

  });
