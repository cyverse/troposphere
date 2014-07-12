/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/common/Time.react'
  ],
  function (React, Backbone, Time) {

    return React.createClass({

      propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      onEditInstanceDetails: function(e){
        e.preventDefault();
        alert("Editing instance details not yet implemented.");
      },

      render: function () {

        var tags = this.props.instance.get('tags').map(function(tag){
          return (
            <li key={tag} className="tag"><a href="#">{tag}</a></li>
          );
        });

        return (
          <div className="resource-info-section section clearfix">

            <div className="resource-image">
              <img src="//www.gravatar.com/avatar/918bf82f238c6c264fc7701e1ff61363?d=identicon&amp;s=113" width="113" height="113"/>
            </div>

            <div className="resource-info">
              <h4 className="resource-name">{this.props.instance.get('name')}</h4>
              <div className="resource-launch-date">Launched on <Time date={this.props.instance.get('start_date')}/></div>
              <div className="resource-tags">Instance Tags:</div>
              <ul className="tags">
                {tags.length > 0 ? tags : <span>This instance has not been tagged.</span>}
              </ul>
            </div>

            <div className="edit-resource-link">
              <a href="#" onClick={this.onEditInstanceDetails}>Edit Instance Info</a>
            </div>

          </div>
        );
      }

    });

  });
