/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'stores/InstanceHistoryStore',
    'moment',
    'crypto',
    'components/common/Gravatar.react'
  ],
  function (React, Backbone, InstanceHistoryStore, moment, CryptoJS, Gravatar) {

    function getState() {
      return {
        instanceHistory: InstanceHistoryStore.getAll(),
        isLoadingMoreResults: false
      };
    }

    return React.createClass({

      propTypes: {

      },

      getInitialState: function () {
        return getState();
      },

      updateState: function () {
        if (this.isMounted()) this.setState(getState());
      },

      componentDidMount: function () {
        InstanceHistoryStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        InstanceHistoryStore.removeChangeListener(this.updateState);
      },

      onLoadMoreInstanceHistory: function(){
        this.setState({isLoadingMoreResults: true});
        InstanceHistoryStore.fetchMore();
      },

      render: function () {
        var instanceHistories = InstanceHistoryStore.getAll();
        var title = "Instance History";
        var content, instanceHistoryItems;

        if(instanceHistories){
          var historyCount = " (" + instanceHistories.length + " instances launched)";
          title += historyCount;

          instanceHistoryItems = instanceHistories.map(function (instance) {
            var startDate = instance.get('start_date');
            var endDate = instance.get('end_date');

            var formattedStartDate = startDate.format("MMM DD, YYYY");
            var formattedEndDate = endDate.format("MMM DD, YYYY");

            var now = moment();
            var timeSpan = now.diff(startDate, "days");

            var instanceHistoryHash = CryptoJS.MD5(instance.id);
            var iconSize = 63;

            return (
              <div key={instance.id}>
                <div className="image-versions">
                  <ul>
                    <li>
                      <div>
                        <Gravatar hash={instanceHistoryHash} size={iconSize}/>
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

          // Load more instances from history
          var buttonStyle = {
            margin: "auto",
            display: "block"
          };

          var loadingStyle= {
            margin: "0px auto"
          };

          var moreHistoryButton = null;
          if(instanceHistories.meta.next){
            if(this.state.isLoadingMoreResults){
              moreHistoryButton = (
                <div style={loadingStyle} className="loading"></div>
              );
            }else {
              moreHistoryButton = (
                <button style={buttonStyle} className="btn btn-default" onClick={this.onLoadMoreInstanceHistory}>
                  Show More History
                </button>
              );
            }
          }

          content = [
            instanceHistoryItems,
            moreHistoryButton
          ];

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
