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
              <div key={instance.id}>
                <strong>{instance.get('name')}</strong>
                <ul>
                  <li>{"start_date: " + instance.get('start_date').format("MMM DD, YYYY")}</li>
                  <li>{"end_date: " + instance.get('end_date').format("MMM DD, YYYY")}</li>
                </ul>
              </div>
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
