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
        volume: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      onEditInformation: function(e){
        e.preventDefault();
        alert("Editing instance details not yet implemented.");
      },

      render: function () {
        return (
          <div className="resource-info-section section clearfix">

            <div className="resource-image">
              <img src="//www.gravatar.com/avatar/918bf82f238c6c264fc7701e1ff61363?d=identicon&amp;s=113" width="113" height="113"/>
            </div>

            <div className="resource-info">
              <h4 className="resource-name resource-name">
                {this.props.volume.get('name')}
              </h4>
              <div className="resource-launch-date">
                Launched on <Time date={this.props.volume.get('start_date')}/>
              </div>
            </div>

            <div className="edit-resource-link">
              <a href="#" onClick={this.onEditInformation}>Edit Volume Info</a>
            </div>

          </div>
        );
      }

    });

  });
