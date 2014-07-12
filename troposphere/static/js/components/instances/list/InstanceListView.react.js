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
        instances: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      getStatus: function(instance){
        var status = instance.get('status');
        if(!status){
          return (
            <td>Launching</td>
          )
        }
        var statusLight;
        if(status === "active"){
          statusLight = <span className="instance-status-light active"></span>;
        }else if(status === "suspended"){
          statusLight = <span className="instance-status-light suspended"></span>;
        }else if(status === "shutoff"){
          statusLight = <span className="instance-status-light stopped"></span>;
        }

        var capitalizedStatus = status.charAt(0).toUpperCase() + status.slice(1);
        var style = {};
        if(capitalizedStatus === "Error") {
          capitalizedStatus = "Launch failed. Atmosphere at capacity.";
          style = {
            color: "#d44950"
          }
        }

        return (
          <td>
            {statusLight}
            <span style={style}>{capitalizedStatus}</span>
          </td>
        );
      },

      render: function () {
        var instances = this.props.instances.map(function (instance) {
          var instanceName = instance.get('name');
          var dateCreated = instance.get('start_date');
          var instanceDetailsUrl = URL.instance(instance, {absolute: true});

          var validStates = ["active", "error", "active - deploy_error", "suspended"];
          var instanceInValidState = validStates.indexOf(instance.get('status')) >= 0;

          var instanceProvider = this.props.providers.get(instance.get('identity').provider);

          var loadingStyles = {};
          if(!instanceInValidState){
            loadingStyles = {
              "vertical-align": "inherit",
              "display": "inline-block",
              "margin-left": "10px",
              "margin-top": "3px"
            }
          }

          if (!instance.id) {
            return (
              <tr className="loading-row">
                <td>
                  <div className="loading-tiny-inline"></div>
                  <span>{instanceName}</span>
                </td>
                {this.getStatus(instance)}
                <td>
                  <Time date={dateCreated}/>
                </td>
                <td>
                  <strong>{instanceProvider.get('name')}</strong>
                </td>
              </tr>
            );
          } else {
            return (
              <tr key={instance.id}>
                <td>
                  {instanceInValidState ? null : <div className="loading-tiny-inline"></div>}
                  <a style={loadingStyles} href={instanceDetailsUrl}>
                    {instanceName}
                  </a>
                </td>
                {this.getStatus(instance)}
                <td>
                  <Time date={dateCreated}/>
                </td>
                <td>
                  <strong>{instanceProvider.get('name')}</strong>
                </td>
              </tr>
            );
          }

        }.bind(this));

        var helpText = function(){
          return (
            <div>
              <p>This page shows instances you've created across all providers</p>
            </div>
          );
        };

        var imagesUrl = URL.images(null, {absolute: true});

        return (
          <div className="container">
            <PageHeader title="All Instances" helpText={helpText}/>
            <a href={imagesUrl} className="btn btn-primary pull-right">Launch an Instance</a>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Provider</th>
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
