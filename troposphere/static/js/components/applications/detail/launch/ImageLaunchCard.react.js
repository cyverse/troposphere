/** @jsx React.DOM */

define(
  [
    'react',
    'components/common/Gravatar.react',
    'backbone',
    'url',
    '../../common/Bookmark.react',
    'context'
  ],
  function (React, Gravatar, Backbone, URL, Bookmark, context) {

    return React.createClass({

      propTypes: {
        application: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        onLaunch: React.PropTypes.func.isRequired
      },

      render: function () {
        var app = this.props.application;

        var iconSize = 145;
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

        // Hide bookmarking on the public page
        var bookmark;
        if(context.profile){
          bookmark = (
            <Bookmark application={app}/>
          );
        }

        var button;
        if(context.profile){
          button = (
            <button className='btn btn-primary launch-button' onClick={this.props.onLaunch}>
              Launch
            </button>
          );
        }else{
          var loginUrl = URL.login(null, {relative: true});
          button = (
            <a className='btn btn-primary launch-button' href={loginUrl}>
              Login to Launch
            </a>
          );
        }

        return (
          <div className='image-launch-card'>
            <div className='icon-container'>
              <a>
                {icon}
              </a>
            </div>
            {button}
            {bookmark}
          </div>
        );
      }

    });

  });
