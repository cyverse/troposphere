/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'stores',
    'components/common/tags/ViewTags.react',
    'components/common/Gravatar.react'
  ],
  function (React, Backbone, stores, Tags, Gravatar) {

    return React.createClass({

      propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        onClick: React.PropTypes.func
      },

      handleClick: function () {
        if (this.props.onClick) this.props.onClick(this.props.image);
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
          iconSize = 67,
          icon;

        if (image.get('icon')) {
          icon = (
            <img src={image.get('icon')} width={iconSize} height={iconSize}/>
          );
        } else {
          icon = (
            <Gravatar hash={image.get('uuid_hash')} size={iconSize} type={type}/>
          );
        }

        return (
          <li onClick={this.handleClick}>
            <div className="app-card">
              <div>
                <span className="icon-container">
                  {icon}
                </span>
                <span className="app-name">
                  <h4 className="name">{image.get('name')}</h4>
                  <div>
                    <span>by </span>
                    <strong>{image.get('created_by').username}</strong>
                  </div>
                  {this.renderTags()}
                </span>
              </div>
              <p className="description">
                {image.get('description')}
              </p>
            </div>
          </li>
        )
      }

    });

  });
