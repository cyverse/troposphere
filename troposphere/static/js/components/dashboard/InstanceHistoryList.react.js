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

      // todo: find a better way to handle this
      // we're listening to changes to the store because the *assumption* is that when the store changes we
      // have a new page of results. This is only true because right now this is the only component that uses
      // the InstanceHistoryStore.  But if we launch an instance and add it to the store (which we don't
      // do currently) this would assume that "add" operations was a "oh, new page of results, sweet!"
      // And that would be an awful lie :(

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

        // we're fetching the applications before the app loads because we need to display links to the images
        // on the dashboard in the instance history, and (at the moment) there's no way to know which image a
        // machine belongs to without searching through the images
        var applications = stores.ApplicationStore.getAll();

        var title = "Instance History";
        var content, instanceHistoryItems;

        if(instanceHistories && applications){
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

            var instanceHistoryHash = CryptoJS.MD5(instance.id.toString()).toString();
            var iconSize = 63;

            var application = stores.ApplicationStore.getApplicationWithMachine(instance.get('machine_alias'));
            var applicationUrl = application ? url.application(application) : "";
            var applicationName = application ? application.get('name') : "[image no longer exists]";
            var applicationLink;

            if(application){
              applicationLink = (
                <a href={applicationUrl}>{applicationName}</a>
              )
            }else{
              applicationLink = (
                <strong>{applicationName}</strong>
              )
            }

            var type = stores.ProfileStore.get().get('icon_set');

            return (
              <div key={instance.id}>
                <div className="instance-history">
                  <ul>
                    <li>
                      <div>
                        <Gravatar hash={instanceHistoryHash} size={iconSize} type={type}/>
                        <div className="instance-history-details">
                          <strong className="name">{instance.get('name')}</strong>
                          <div>Launched from {applicationLink}</div>
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
