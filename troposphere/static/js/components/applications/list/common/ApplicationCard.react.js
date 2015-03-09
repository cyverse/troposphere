define(function (require) {

  var React = require('react'),
      Gravatar = require('components/common/Gravatar.react'),
      Backbone = require('backbone'),
      URL = require('url'),
      Bookmark = require('../../common/Bookmark.react'),
      context = require('context'),
      Tags = require('../../detail/tags/Tags.react'),
      stores = require('stores'),
      ApplicationCardDescription = require('./ApplicationCardDescription.react'),
      moment = require('moment');

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

      return (
        <div className='app-card'>
          <div className='icon-container'>
            <a href={appUri} onClick={this.onAppClick}>
              {icon}
            </a>
          </div>
          <div className='app-name'>
            <a href={appUri}>{app.get('name')}</a>
          </div>
          <div className="creation-details">
            <time>{applicationCreationDate}</time> by <strong>{app.get('created_by').username}</strong>
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
