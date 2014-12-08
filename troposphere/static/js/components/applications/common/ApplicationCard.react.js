/** @jsx React.DOM */

define(
  [
    'react',
    'components/common/Gravatar.react',
    'backbone',
    'url',
    './Rating.react',
    './Bookmark.react',
    'context',
    '../detail/tags/Tags.react',
    'stores',
    './ApplicationCardDescription.react'
  ],
  function (React, Gravatar, Backbone, URL, Rating, Bookmark, context, Tags, stores, ApplicationCardDescription) {

    return React.createClass({

      propTypes: {
        application: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        tags: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      onAppClick: function (e) {
        e.preventDefault();
        var url = URL.application(this.props.application);
        Backbone.history.navigate(url, {trigger: true});
      },

      render: function () {
        var app = this.props.application;
        var type = stores.ProfileStore.get().get('icon_set');
        var imageTags = stores.TagStore.getImageTags(app);
        var applicationCreationDate = moment(app.get('start_date')).format("MMM D, YYYY");

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

        var appUri = URL.application(app);

        // Hide bookmarking on the public page
        var bookmark;
        if(context.profile){
          bookmark = (
            <Bookmark application={app}/>
          );
        }

        // todo: Put ratings back when we actually implement them, not while they're random
        //var ratings = <Rating up={app.get('votes').up} down={app.get('votes').down} />

        return (
          <div className='app-card'>
            <div className='icon-container'>
              <a href={appUri} onClick={this.onAppClick}>
                {icon}
              </a>
            </div>
            <div className='app-name'>
              {app.get('name')}
            </div>
            <div className="creation-details">
              <time>{applicationCreationDate}</time> by <strong>{app.get('created_by')}</strong>
            </div>
            {bookmark}
            <Tags activeTags={imageTags}
                  tags={this.props.tags}
            />
            <ApplicationCardDescription application={app}/>
          </div>
        );
      }

    });

  });
