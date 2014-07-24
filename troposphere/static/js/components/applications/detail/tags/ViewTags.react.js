/** @jsx React.DOM */

define(
  [
    'react',
    'backbone'
  ],
  function (React, Backbone) {

    return React.createClass({

      propTypes: {
        tags: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        activeTags: React.PropTypes.array.isRequired
      },

      render: function () {
        var tags = this.props.activeTags.map(function(tag){
          return (
            <li key={tag} className="tag">
                <a href="#">{tag}</a>
            </li>
          );
        });

        var content;
        if(tags.length > 0){
          content = tags;
        }else{
          content = (
            <span>This resource has not been tagged.</span>
          )
        }

        return (
          <ul className="tags">
            {content}
          </ul>
        );

      }

    });

  });
