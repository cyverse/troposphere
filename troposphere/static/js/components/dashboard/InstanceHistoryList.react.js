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
            var startDate = instance.get('start_date');
            var endDate = instance.get('end_date');

            var formattedStartDate = startDate.format("MMM DD, YYYY");
            var formattedEndDate = endDate.format("MMM DD, YYYY");

            var now = moment();
            var timeSpan = now.diff(startDate, "days");

            return (
              <div key={instance.id}>
                <div className="image-versions">
                  <ul>
                    <li>
                      <div>
                        <img className="image-version-image" src="http://placehold.it/63x63"/>
                        <div className="image-version-details">
                          <div className="version">
                            <span>
                              <strong>{instance.get('name')}</strong>
                            </span>
                          </div>
                          <div>{formattedStartDate + " - " + formattedEndDate}</div>
                          <div>{timeSpan + " days ago"}</div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
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
