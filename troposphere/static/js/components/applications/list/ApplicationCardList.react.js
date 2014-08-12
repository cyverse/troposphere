/** @jsx React.DOM */

define(
  [
    'react',
    '../common/ApplicationCard.react'
  ],
  function (React, ApplicationCard) {

    return React.createClass({

      propTypes: {
        applications: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        tags: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      render: function () {
        var apps = this.props.applications;
        var appCards = apps.map(function (app) {
          return (
            <li key={app.id}>
              <ApplicationCard application={app}
                               tags={this.props.tags}/>
            </li>
          );
        }.bind(this));

        return (
          <div>
            <h3>{this.props.title}</h3>
            <ul className='app-card-list'>
              {appCards}
            </ul>
          </div>
        );
      }

    });

  });
