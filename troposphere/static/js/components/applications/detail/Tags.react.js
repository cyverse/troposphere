/** @jsx React.DOM */

define(
  [
    'react'
  ],
  function (React) {

    return React.createClass({

      render: function () {
        var tags = this.props.tags.map(function (tag) {
          return (
            <li className="tag" key={tag}>
              <a href="#">
                {tag}
              </a>
            </li>
          );
        });

        return (
          <ul className="tags">
            {tags}
          </ul>
        );
      }

    });

  });
