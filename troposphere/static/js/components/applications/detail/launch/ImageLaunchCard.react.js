
define(
  [
    'react',
    'components/common/Gravatar.react',
    'backbone',
    'url',
    '../../common/Bookmark.react',
    'context',
    'stores'
  ],
  function (React, Gravatar, Backbone, URL, Bookmark, context, stores) {

    return React.createClass({

      propTypes: {
        application: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        onLaunch: React.PropTypes.func.isRequired
      },

      render: function () {
        var app = this.props.application;
        var type = stores.ProfileStore.get().get('icon_set');

        var iconSize = 145;
        var icon;
        if (app.get('icon')) {
          icon = (
            <img src={app.get('icon')} width={iconSize} height={iconSize}/>
          );
        } else {
          icon = (
            <Gravatar hash={app.get('uuid_hash')} size={iconSize} type={type}/>
          );
        }

        // Hide bookmarking on the public page
        var bookmark;
        if (context.profile) {
          bookmark = (
            <Bookmark application={app}/>
          );
        }

        var button;
        if (context.profile) {
          button = (
            <button className='btn btn-primary launch-button' onClick={this.props.onLaunch}>
              Launch
            </button>
          );
        } else {
          var loginUrl = URL.login(null, {relative: true}),
            imageUrl = URL.application(this.props.application),
            fullUrl = loginUrl + "?redirect=" + imageUrl + "?beta=true";

          button = (
            <a className='btn btn-primary launch-button' href={fullUrl}>
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
