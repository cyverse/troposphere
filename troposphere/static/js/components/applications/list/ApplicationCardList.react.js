/** @jsx React.DOM */

define(
  [
    'react',
    '../common/ApplicationCard.react'
  ],
  function (React, ApplicationCard) {

    return React.createClass({

      render: function () {
        var apps = this.props.applications;
        var appCards = apps.map(function (app) {
          return (
            <li key={app.id}>
              <ApplicationCard application={app}/>
            </li>
          );
        });

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
