/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'stores/InstanceHistoryStore',
    'moment'
  ],
  function (React, Backbone, InstanceHistoryStore, moment) {

    return React.createClass({

      propTypes: {

      },

      render: function () {
        var instanceHistories = InstanceHistoryStore.getAll();
        var title = "Instance History";
        var content;

        if(instanceHistories){
          var historyCount = " (" + instanceHistories.length + " instances launched)";
          title += historyCount;

          content = instanceHistories.slice(0,5).map(function (instance) {
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
                          <div>{timeSpan + " days ago, on " + instance.get('provider')}</div>
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
            <h2>{title}</h2>
            {content}
          </div>
        );
      }

    });

  });
