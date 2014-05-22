/** @jsx React.DOM */

define(
  [
    'react',
    'components/common/Gravatar.react',
    'backbone',
    'url',
    '../Rating.react',
    '../Bookmark.react'
  ],
  function (React, Gravatar, Backbone, URL, Rating, Bookmark) {

    return React.createClass({

      getDefaultProps: function () {
        return {
          showDetails: true,
          showLaunch: false
        };
      },

      onAppClick: function (e) {
        e.preventDefault();
        var url = URL.application(this.props.application);
        Backbone.history.navigate(url, {trigger: true});
      },

      render: function () {
        var app = this.props.application;

        var iconSize = 150;
        var icon;
        if (app.get('icon')) {
          icon = (
            <img src={app.get('icon')} width={iconSize} height={iconSize}/>
          );
        } else {
          icon = (
            <Gravatar hash={app.get('uuid_hash')} size={iconSize}/>
          );
        }

        var appUri = URL.application(app, {absolute: true});

        return (
          <div className='app-card'>
            <div className='icon-container'>
              <a href={appUri} onClick={this.onAppClick}>
                {icon}
              </a>
            </div>
            <div className='app-name'>
              <a href={appUri} onClick={this.onAppClick} title={app.get('name_or_id')}>
                {app.get('name_or_id')}
              </a>
            </div>
            <Rating rating={app.get('rating')}/>
            <button className='btn btn-primary btn-block launch-button' onClick={this.props.onLaunch}>
              Launch
            </button>
            <Bookmark application={app}/>
          </div>
        );
      }

    });

  });
