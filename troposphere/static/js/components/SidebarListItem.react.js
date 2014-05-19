/** @jsx React.DOM */

define(
  [
    'react',
    'underscore',
    'components/common/Glyphicon.react'
  ],
  function (React, _, Glyphicon) {

    return React.createClass({

      handleClick: function (e) {
        e.preventDefault();
        this.props.onNavigate(this.props.id.join('/'), {trigger: true});
      },

      render: function () {
        var icon = this.props.icon ? <Glyphicon name={this.props.icon}/> : null;
        var href = '/application/' + this.props.id.join('/');

        return (
          <li className={this.props.active ? 'active' : ''}>
            <a href={href} onClick={this.handleClick}>
              {icon}
              {this.props.text}
            </a>
            {this.props.children}
          </li>
        );
      }
    });

  });
