/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'stores',
    'components/common/tags/ViewTags.react'
  ],
  function (React, Backbone, stores, Tags) {

    return React.createClass({

      propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        onClick: React.PropTypes.func
      },

      handleClick: function(){
        if(this.props.onClick) this.props.onClick(this.props.image);
      },

      renderTags: function(){
        var tags = stores.TagStore.getAll();
        var activeTags = stores.TagStore.getImageTags(this.props.image);

        return (
          <Tags tags={tags} activeTags={activeTags}/>
        );
      },

      render: function () {
        var image = this.props.image;

        return (
          <li onClick={this.handleClick}>
            <div className="app-card">
              <div>
                <span className="icon-container">
                  <img src="//www.gravatar.com/avatar/c45690bf6dcd6f52619cd2a1308fe396?d=identicon&amp;s=67" width="67" height="67"/>
                </span>
                <span className="app-name">
                  <h4 className="name">{image.get('name')}</h4>
                  <div>
                    <span>by </span>
                    <strong>atmoadmin</strong>
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
