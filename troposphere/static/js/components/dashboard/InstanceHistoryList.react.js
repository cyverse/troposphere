define(function (require) {

  var React = require('react'),
      stores = require('stores'),
      moment = require('moment'),
      CryptoJS = require('crypto'),
      Gravatar = require('components/common/Gravatar.react'),
      Router = require('react-router');

  return React.createClass({

    getState: function() {
      return {
        instanceHistory: stores.InstanceHistoryStore.getAll(),
        isLoadingMoreResults: false
      };
    },

    getInitialState: function () {
      return this.getState();
    },

    updateState: function () {
      if (this.isMounted()) this.setState(this.getState());
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
          var startDate = instance.get('start_date'),
              endDate = instance.get('end_date'),
              formattedStartDate = startDate.format("MMM DD, YYYY"),
              formattedEndDate = endDate.format("MMM DD, YYYY"),
              now = moment(),
              timeSpan = now.diff(startDate, "days"),
              instanceHistoryHash = CryptoJS.MD5((instance.id || instance.cid).toString()).toString(),
              iconSize = 63,
              type = stores.ProfileStore.get().get('icon_set'),
              application = stores.ApplicationStore.getApplicationWithMachine(instance.get('machine_alias')),
              applicationName = application ? application.get('name') : "[image no longer exists]",
              applicationLink;

          if(!endDate.isValid()) formattedEndDate = "Present";

          if(application){
            applicationLink = (
              <Router.Link to="image-details" params={{imageId: application.id}}>
                {applicationName}
              </Router.Link>
            )
          }else{
            applicationLink = (
              <strong>{applicationName}</strong>
            )
          }

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
