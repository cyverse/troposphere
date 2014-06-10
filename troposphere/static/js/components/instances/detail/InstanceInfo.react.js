/** @jsx React.DOM */

define(
  [
    'react',
    'components/common/Time.react'
  ],
  function (React, Time) {

    return React.createClass({

      propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {

        var tags = this.props.instance.get('tags').map(function(tag){
          return (
            <li key={tag} className="tag"><a href="#">{tag}</a></li>
          );
        });

        return (
          <div className="instance-info-section clearfix">

            <div className="instance-image">
              <a href="/application/images/9ab516c9-c39f-595e-a990-977642da4c0e">
                <img src="//www.gravatar.com/avatar/918bf82f238c6c264fc7701e1ff61363?d=identicon&amp;s=100" width="100" height="100"/>
              </a>
            </div>

            <div className="instance-info">
              <h4 className="instance-name">{this.props.instance.get('name')}</h4>
              <div className="instance-launch-date">Launched on <Time date={this.props.instance.get('start_date')}/></div>
              <div className="instance-tags">Instance Tags:</div>
              <ul className="tags">
                {tags}
              </ul>
            </div>

            <div className="edit-instance-link">
              <a href="#">Edit Instance Info</a>
            </div>

          </div>
        );
      }

    });

  });
