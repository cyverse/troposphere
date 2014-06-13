/** @jsx React.DOM */

define(
  [
    'react',
    'underscore',
    'url',
    'components/common/PageHeader.react',
    'components/common/Time.react',
    'backbone'
  ],
  function (React, _, URL, PageHeader, Time, Backbone) {

    return React.createClass({

      propTypes: {
        instances: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      render: function () {
        var instances = this.props.instances.map(function (instance) {
          var instanceName = instance.get('name');
          var dateCreated = instance.get('start_date');
          var instanceDetailsUrl = URL.instance(instance, {absolute: true});

          if (!instance.id) {
            return (
              <tr className="loading-row">
                <td>
                  <div className="loading-tiny-inline"></div>
                  <span>{instanceName}</span>
                </td>
                <td>
                  <Time date={dateCreated}/>
                </td>
              </tr>
            );
          } else {
            return (
              <tr>
                <td>
                  <a href={instanceDetailsUrl}>
                    {instanceName}
                  </a>
                </td>
                <td>
                  <Time date={dateCreated}/>
                </td>
              </tr>
            );
          }

        });

        var helpText = function(){
          return (
            <div>
              <p>This page shows instances you've created across all providers</p>
            </div>
          );
        };

        return (
          <div>
            <PageHeader title="All Instances" helpText={helpText}/>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {instances}
              </tbody>
            </table>
          </div>
        );
      }

    });

  });
