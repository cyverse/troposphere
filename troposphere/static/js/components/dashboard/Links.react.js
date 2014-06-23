/** @jsx React.DOM */

define(
  [
    'react',
    'url'
  ],
  function (React, URL) {

    return React.createClass({

      render: function () {
        /*
          Link to Images titled "Launch an Instance" or something like that.
          Link to Help documentation and the FAQ.
         */
        return (
          <div className="">
            <h2>Quick Links</h2>
            <div><a href={URL.images(null, {absolute: true})}>Launch an Instance</a></div>
            <div><a href={URL.help(null, {absolute: true})}>Help, Documentation and FAQ</a></div>
          </div>
        );
      }

    });

  });
