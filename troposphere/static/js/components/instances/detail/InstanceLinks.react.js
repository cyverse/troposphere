/** @jsx React.DOM */

define(
  [
    'react'
  ],
  function (React) {

    return React.createClass({

      renderLink: function (text, url) {
        return (
          <li>
            <a href={url} target='_blank'>
              {text}
            </a>
          </li>
        );
      },

      render: function () {
        var instance = this.props.instance;
        return (
          <div>
            <h2>Links</h2>
            <ul>
              {this.renderLink("Web Shell", instance.get('shell_url'))}
              {this.renderLink("Remote Desktop", instance.get('vnc_url'))}
            </ul>
          </div>
        );
      }

    });

  });
