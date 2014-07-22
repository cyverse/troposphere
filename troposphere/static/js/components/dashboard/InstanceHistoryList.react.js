/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'stores/InstanceHistoryStore'
  ],
  function (React, Backbone, InstanceHistoryStore) {

    return React.createClass({

      propTypes: {
        instances: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      render: function () {
        var instanceHistories = InstanceHistoryStore.getAll();
        var content;

        if(instanceHistories){
          content = instanceHistories.map(function (instance) {
            return (
              <div key={instance.id}>{instance.get('name')}</div>
            );
          }.bind(this));
        }else{
          content = (
            <div className="loading"></div>
          );
        }

        return (
          <div>
            <h2>Instance History</h2>
            {content}
          </div>

        );
      }

    });

  });
