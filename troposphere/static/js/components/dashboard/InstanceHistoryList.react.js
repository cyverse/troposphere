define(function (require) {

  var React = require('react'),
    stores = require('stores'),
    moment = require('moment'),
    CryptoJS = require('crypto-js'),
    Gravatar = require('components/common/Gravatar.react'),
    Router = require('react-router');

  return React.createClass({

    getInitialState: function () {
      return {
        isLoadingMoreResults: false,
        nextUrl: null
      }
    },

    updateState: function () {
      var instanceHistories = stores.InstanceHistoryStore.getAll(),
        state = {};

      if (instanceHistories && instanceHistories.meta.next !== this.state.nextUrl) {
        state.isLoadingMoreResults = false;
        state.nextUrl = null;
      }

      if (this.isMounted()) this.setState(state);
    },

    componentDidMount: function () {
      stores.InstanceHistoryStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function () {
      stores.InstanceHistoryStore.removeChangeListener(this.updateState);
    },

    onLoadMoreInstanceHistory: function () {
      var instanceHistories = stores.InstanceHistoryStore.getAll();

      this.setState({
        isLoadingMoreResults: true,
        nextUrl: instanceHistories.meta.next
      });
      stores.InstanceHistoryStore.fetchMore();
    },

    renderTitle: function () {
      var instanceHistories = stores.InstanceHistoryStore.getAll(),
        title = "Instance History",
        historyCount;

      if (instanceHistories) {
        historyCount = " (" + instanceHistories.meta.count + " instances launched)";
        title += historyCount;
      }

      return title;
    },

    renderLoadMoreHistoryButton: function (instanceHistories) {
      // Load more instances from history
      var buttonStyle = {
          margin: "auto",
          display: "block"
        },
        loadingStyle = {
          margin: "0px auto"
        },
        moreHistoryButton = null;

      if (instanceHistories.meta.next) {
        if (this.state.isLoadingMoreResults) {
          moreHistoryButton = (
            <div style={loadingStyle} className="loading"></div>
          );
        } else {
          moreHistoryButton = (
            <button style={buttonStyle} className="btn btn-default" onClick={this.onLoadMoreInstanceHistory}>
              Show More History
            </button>
          );
        }
      }

      return moreHistoryButton;
    },

    renderBody: function () {
      var instanceHistories = stores.InstanceHistoryStore.getAll(),
        instanceHistoryItems;

      if (!instanceHistories) return <div className="loading"></div>;

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
          imageId = instance.get('application_id'),
          application = imageId ? stores.ApplicationStore.get(imageId) : null,
          applicationName = application ? application.get('name') : "[image no longer exists]",
          applicationLink;

        if (!endDate.isValid()) formattedEndDate = "Present";

        if (application) {
          applicationLink = (
            <Router.Link to="image-details" params={{imageId: application.id}}>
              {applicationName}
            </Router.Link>
          )
        } else {
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

      return (
        <div>
          {instanceHistoryItems}
          {this.renderLoadMoreHistoryButton(instanceHistories)}
        </div>
      );
    },

    render: function () {
      return (
        <div>
          <h2>
            {this.renderTitle()}
          </h2>
          {this.renderBody()}
        </div>
      );
    }

  });

});
