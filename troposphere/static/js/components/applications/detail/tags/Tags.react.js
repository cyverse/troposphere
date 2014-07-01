/** @jsx React.DOM */

define(
  [
    'react',
    'context'
  ],
  function (React, context) {

    return React.createClass({

      propTypes: {
        tags: React.PropTypes.array.isRequired
      },

      onTagClicked: function(e){
        e.preventDefault();
        alert("Tag selection not implemented yet.");
      },

      render: function () {
        var tags = this.props.tags.map(function (tag) {
          if(context.profile) {
            return (
              <li className="tag" key={tag}>
                <a href="#" onClick={this.onTagClicked}>
                {tag}
                </a>
              </li>
            );
          }else{
            return (
              <li className="tag" key={tag}>
                <span>{tag}</span>
              </li>
            );
          }
        }.bind(this));

        return (
          <ul className="tags">
            {tags}
          </ul>
        );
      }

    });

  });
