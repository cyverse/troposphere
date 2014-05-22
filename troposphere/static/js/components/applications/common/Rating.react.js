/** @jsx React.DOM */

define(
  [
    'react'
  ],
  function (React) {

    return React.createClass({

      render: function () {
        var repeatString = function (string, num) {
          return new Array(num + 1).join(string);
        };

        var stars = repeatString("\u2605", this.props.rating) +
                    repeatString("\u2606", 5 - this.props.rating);

        return (
          <div className='star-rating'>
            {stars}
          </div>
        );
      }

    });

  });
