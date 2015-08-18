define(function (require) {

  var React = require('react'),
      stores = require('stores'),
      moment = require('moment'),
      CryptoJS = require('crypto'),
      Gravatar = require('components/common/Gravatar.react'),
      Router = require('react-router');

  return React.createClass({

    getInitialState: function () {
      return {
        isLoadingMoreResults: false,
        nextUrl: null
      }
    },

    updateState: function() {
      var instanceHistories = stores.InstanceHistoryStore.getAll(),
          state = {};

      if(instanceHistories && instanceHistories.meta.next !== this.state.nextUrl){
        state.isLoadingMoreResults = false;
        state.nextUrl = null;
      }

      if (this.isMounted()) this.setState(state);
    },

    componentDidMount: function () {
      stores.InstanceHistoryStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function() {
      stores.InstanceHistoryStore.removeChangeListener(this.updateState);
    },

    onLoadMoreInstanceHistory: function(){
      var instanceHistories = stores.InstanceHistoryStore.getAll();

      this.setState({
        isLoadingMoreResults: true,
        nextUrl: instanceHistories.meta.next
      });
      stores.InstanceHistoryStore.fetchMore();
    },

    renderTitle: function(){
      var instanceHistories = stores.InstanceHistoryStore.getAll(),
          title = "Instance History",
          historyCount;

      if(instanceHistories) {
        historyCount = " (" + instanceHistories.meta.count + " instances launched)";
        title += historyCount;
      }

      return title;
    },

    renderLoadMoreHistoryButton: function(instanceHistories){
      // Load more instances from history
      var buttonStyle = {
            margin: "auto",
            display: "block"
          },
          loadingStyle= {
            margin: "0px auto"
          },
          moreHistoryButton = null;

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

      return moreHistoryButton;
    },

    renderBody: function () {
      var instanceHistories = stores.InstanceHistoryStore.getAll(),
          instances = stores.InstanceStore.fetchWhereNoCache({'archived': 'true'}),
          providers = stores.ProviderStore.getAll(),
          instanceHistoryItems;

      if(!instanceHistories || !instances || !providers) return <div className="loading"></div>;

      instanceHistoryItems = instanceHistories.map(function (instance) {
        var providerId = null,
            imageId = null,
            provider = null,
            instanceId = instance.get('instance').id,
            _instance= stores.InstanceStore.get(instanceId);
        if(_instance) {
            var instanceImage = _instance.get('image');
            providerId = _instance.get('provider');
            imageId = instanceImage.id;
        } else {
            providerId = null;
            imageId = null;
        }
        if(providerId) {
          provider = providerId ? stores.ProviderStore.get(providerId) : null;
          provider = provider.get('name');
        } else {
          provider = null;
        }

        var startDate = instance.get('start_date'),
            endDate = instance.get('end_date'),
            formattedStartDate = startDate.format("MMM DD, YYYY"),
            formattedEndDate = endDate.format("MMM DD, YYYY"),
            now = moment(),
            timeSpan = now.diff(startDate, "days"),
            instanceHistoryHash = CryptoJS.MD5((instance.id || instance.cid).toString()).toString(),
            iconSize = 63,
            type = stores.ProfileStore.get().get('icon_set'),
            image = imageId ? stores.ImageStore.get(imageId) : null,
            imageName = image ? image.get('name') : "[image no longer exists]",
            imageLink;

        if(!endDate.isValid()) formattedEndDate = "Present";

        if(image){
          imageLink = (
            <Router.Link to="image-details" params={{imageId: image.id}}>
              {imageName}
            </Router.Link>
          )
        }else{
          imageLink = (
            <strong>{imageName}</strong>
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
                      <div>Launched from {imageLink}</div>
                      <div>{"Ran: " + formattedStartDate + " - " + formattedEndDate}</div>
                    </div>
                    <span className="launch-info">
                      <strong>{timeSpan + " days ago"}</strong>
                      {" on " + provider}
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
