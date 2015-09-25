define(function (require) {

  var React = require('react/addons'),
    Gravatar = require('components/common/Gravatar.react'),
    Backbone = require('backbone'),
    Bookmark = require('components/images/common/Bookmark.react'),
    context = require('context'),
    Tags = require('components/images/detail/tags/Tags.react'),
    stores = require('stores'),
    modals = require('modals'),
    navigator = require('navigator'),
    Showdown = require('showdown'),
    moment = require('moment'),
    Router = require('react-router');

  return React.createClass({

    propTypes: {
      image: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    handleEdit: function(){
      modals.ImageModals.edit(this.props.image);
    },

    render: function () {
      var image = this.props.image,
        type = stores.ProfileStore.get().get('icon_set'),
        imageTags = stores.TagStore.getImageTags(image),
        imageCreationDate = moment(image.get('start_date')).format("MMM D, YYYY"),
        converter = new Showdown.Converter(),
        description = image.get('description');
      if(!description) {
          description = "No Description Provided."
      }
      var descriptionHtml = converter.makeHtml(description),
        iconSize = 67,
        icon;

      if(image.get('icon')) {
        icon = (
          <img src={image.get('icon')} width={iconSize} height={iconSize}/>
        );
      } else {
        icon = (
          <Gravatar hash={image.get('uuid_hash')} size={iconSize} type={type}/>
        );
      }

      // Hide bookmarking on the public page
      var bookmark;
      if (context.profile) {
        bookmark = (
          <Bookmark image={image}/>
        );
      }

      return (
        <div className='app-card'>
          <div>
            <span className='icon-container'>
              <Router.Link to="image-details" params={{imageId: image.id}}>
                {icon}
              </Router.Link>
            </span>
            <span className='app-name'>
              <h4>
                <Router.Link to="image-details" params={{imageId: image.id}}>
                  {image.get('name')}
                </Router.Link>
              </h4>
              <div><time>{imageCreationDate}</time> by <strong>{image.get('created_by').username}</strong></div>
              <Tags activeTags={imageTags}/>
            </span>
          </div>
           <button onClick={this.handleEdit} type="button" className="btn btn-primary btn-lg pull-right">Edit</button>
          <div dangerouslySetInnerHTML={{__html: descriptionHtml}}/>
          {bookmark}
        </div>
      );
    }

  });

});
