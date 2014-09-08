/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'stores',
    'moment',
    'crypto',
    'components/common/Gravatar.react',
    'url'
  ],
  function (React, Backbone, stores, moment, CryptoJS, Gravatar, url) {

    function getState() {
      return {
        instanceHistory: stores.InstanceHistoryStore.getAll(),
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
        stores.InstanceHistoryStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        stores.InstanceHistoryStore.removeChangeListener(this.updateState);
      },

      onLoadMoreInstanceHistory: function(){
        this.setState({isLoadingMoreResults: true});
        stores.InstanceHistoryStore.fetchMore();
      },

      render: function () {
        var instanceHistories = stores.InstanceHistoryStore.getAll();
        var title = "Instance History";
        var content, instanceHistoryItems;

        if(instanceHistories){
          var historyCount = " (" + instanceHistories.meta.count + " instances launched)";
          title += historyCount;

          instanceHistoryItems = instanceHistories.map(function (instance) {
            var startDate = instance.get('start_date');
            var endDate = instance.get('end_date');

            var formattedStartDate = startDate.format("MMM DD, YYYY");
            var formattedEndDate = endDate.format("MMM DD, YYYY");
            if(!endDate.isValid()) formattedEndDate = "Present";

            var now = moment();
            var timeSpan = now.diff(startDate, "days");

            var instanceHistoryHash = CryptoJS.MD5(instance.id).toString();
            var iconSize = 63;

            var application = stores.ApplicationStore.getApplicationWithMachine(instance.get('machine_alias'));
            var applicationUrl = url.application(application);
            var applicationName = application.get('name');

            return (
              <div key={instance.id}>
                <div className="instance-history">
                  <ul>
                    <li>
                      <div>
                        <Gravatar hash={instanceHistoryHash} size={iconSize}/>
                        <div className="instance-history-details">
                          <a className="name">{instance.get('name')}</a>
                          <div>Launched from <a href={applicationUrl}>{applicationName}</a></div>
                          <div>{"Ran: " + formattedStartDate + " - " + formattedEndDate}</div>
                        </div>
                        <span className="launch-info">
                          <strong>{timeSpan + " days ago"}</strong>
                          {" on " + instance.get('provider')}
                        </span>
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

          content = (
            <div>
              {instanceHistoryItems}
              {moreHistoryButton}
            </div>
          );

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
