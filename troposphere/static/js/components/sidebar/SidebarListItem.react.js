/** @jsx React.DOM */

define(
  [
    'react',
    'underscore',
    'components/common/Glyphicon.react'
  ],
  function (React, _, Glyphicon) {

    return React.createClass({

      render: function () {
        var icon = this.props.icon ? <Glyphicon name={this.props.icon}/> : null;
        var href = '/application/' + this.props.id.join('/');

        return (
          <li className={this.props.active ? 'active' : ''}>
            <a href={href}>
              {icon}
              {this.props.text}
            </a>
            {this.props.children}
          </li>
        );
      }
    });

  });
