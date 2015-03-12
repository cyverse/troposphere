define(function (require) {

  var React = require('react'),
      Gravatar = require('components/common/Gravatar.react'),
      Backbone = require('backbone'),
      Bookmark = require('../../common/Bookmark.react'),
      context = require('context'),
      Tags = require('../../detail/tags/Tags.react'),
      stores = require('stores'),
      ApplicationCardDescription = require('./ApplicationCardDescription.react'),
      moment = require('moment'),
      Router = require('react-router');

  return React.createClass({

    propTypes: {
      application: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      tags: React.PropTypes.instanceOf(Backbone.Collection).isRequired
    },

    render: function () {
      var app = this.props.application,
          type = stores.ProfileStore.get().get('icon_set'),
          imageTags = stores.TagStore.getImageTags(app),
          applicationCreationDate = moment(app.get('start_date')).format("MMM D, YYYY"),
          iconSize = 145,
          icon;

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
      if(context.profile){
        bookmark = (
          <Bookmark application={app}/>
        );
      }

      return (
        <div className='app-card'>
          <div className='icon-container'>
            <Router.Link to="image-details" params={{imageId: app.id}}>
              {icon}
            </Router.Link>
          </div>
          <div className='app-name'>
            <Router.Link to="image-details" params={{imageId: app.id}}>
              {app.get('name')}
            </Router.Link>
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
