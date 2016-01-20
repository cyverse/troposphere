
define(
  [
    'react',
    'backbone',
    'stores',
    'moment',
    'components/common/tags/ViewTags.react',
    'components/common/Gravatar.react'
  ],
  function (React, Backbone, stores, moment, Tags, Gravatar) {

    return React.createClass({
      displayName: "Image",

      getInitialState: function(){
          let image = this.props.image;
          let versionList = null;
          let active = false;
            if (image) {
                versionList = image.get('versions');

                if (versionList.length > 0) {
                    active = true;
                }
            }
            return {
                active
            }
      },

      propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        onClick: React.PropTypes.func
      },

      handleClick: function () {
        if (this.state.active) {
            this.props.onSelectImage(this.props.image);
        }
      },

      renderTags: function () {
        var tags = stores.TagStore.getAll();
        var activeTags = stores.TagStore.getImageTags(this.props.image);

        return (
          <Tags tags={tags} activeTags={activeTags} renderLinks={false}/>
        );
      },

      render: function () {
        var image = this.props.image,
          type = stores.ProfileStore.get().get('icon_set'),
          imageCreationDate = moment(image.get('start_date')).format("MMM D, YYYY hh:mm a"),
          iconSize = 67,
          icon;

        // always use the Gravatar icons
        icon = (
          <Gravatar hash={image.get('uuid_hash')} size={iconSize} type={type}/>
        );

        let inactiveClass = !this.state.active ? "disabled" : "";

        return (
            <li onClick={this.handleClick}>
                <div className={`media card ${inactiveClass}`}>
                    <div className="media__img">
                        {icon}
                    </div>
                    <div className="media__content">
                        <div className="row">
                            <div className="col-md-6">
                                <h2 className="t-subheading txt-primary">{image.get('name')}</h2>
                                <time>{imageCreationDate}</time> by <strong>{image.get('created_by').username}</strong>
                            </div>
                            <div className="col-md-6">
                                {this.renderTags()}
                            </div>
                        </div>
                        <p className="media__description">
                            {image.get('description')}
                        </p>
                    </div>
                </div>
            </li>
        )
      }

    });

  });
