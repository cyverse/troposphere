/** @jsx React.DOM */

define(
  [
    'react'
  ],
  function (React) {

    return React.createClass({

      propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

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
        return (
          <div>
            <h2>Links</h2>
            <ul>
              {this.renderLink("Web Shell", this.props.instance.get('shell_url'))}
              {this.renderLink("Remote Desktop", this.props.instance.get('vnc_url'))}
            </ul>
          </div>
        );
      }

    });

  });
