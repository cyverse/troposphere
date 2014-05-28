/** @jsx React.DOM */

define(
  [
    'react',
    'underscore',
    'url',
    'components/common/PageHeader.react'
  ],
  function (React, _, URL, PageHeader) {

    return React.createClass({

      propTypes: {
        volumes: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      render: function () {
        var volumes = this.props.volumes.map(function (volume) {
          var volumeName = volume.get('name');
          var description = volume.get('description') || "No description provided.";
          var volumeDetailsUrl = URL.volume(volume, {absolute: true});

          return (
            <tr>
              <td>
                <a href={volumeDetailsUrl}>
                  {volumeName}
                </a>
              </td>
              <td>{description}</td>
            </tr>
          );
        });

        var helpText = function(){
          return (
            <div>
              <p>This page shows volumes you've created across all providers</p>
            </div>
          );
        }
        return (
          <div>
            <PageHeader title="All Volumes" helpText={helpText}/>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {volumes}
              </tbody>
            </table>
          </div>
        );
      }

    });

  });
