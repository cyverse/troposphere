/** @jsx React.DOM */

define(
  [
    'react',
    'components/PageHeader.react',
    'components/mixins/loading',
    'models/instance',
    'rsvp',
    'components/common/Time.react',
    'controllers/instances',
    'url',
    'components/common/ButtonDropdown.react',
    'components/common/Glyphicon.react',
    './InstanceAttributes.react'
  ],
  function (React, PageHeader, LoadingMixin, Instance, RSVP, Time, InstanceController, URL, ButtonDropdown, Glyphicon, InstanceAttributes) {

    return React.createClass({

      renderLink: function (text, url) {
        return (
          <li>
            <a href={url} target='_blank' className='new-window'>
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
