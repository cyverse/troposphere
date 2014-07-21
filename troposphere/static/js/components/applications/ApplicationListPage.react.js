/** @jsx React.DOM */

define(
  [
    'react',
    './common/SecondaryApplicationNavigation.react',
    'collections/ApplicationCollection',
    './list/ApplicationCardList.react',
    './list/SearchContainer.react',
    'stores/ApplicationStore'
  ],
  function (React, SecondaryApplicationNavigation, ApplicationCollection, ApplicationCardList, ApplicationSearch, ApplicationStore) {

    function getState() {
      return {
        applications: ApplicationStore.getAll(),
        isLoadingMoreResults: false
      };
    }

    return React.createClass({

      getInitialState: function () {
        return getState();
      },

      updateState: function () {
        if (this.isMounted()) this.setState(getState());
      },

      componentDidMount: function () {
        ApplicationStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        ApplicationStore.removeChangeListener(this.updateState);
      },

      onLoadMoreImages: function(){
        this.setState({isLoadingMoreResults: true});
        ApplicationStore.fetchMore();
      },

      render: function () {
        var content;
        if (!this.state.applications) {
          content = (
            <div className="loading"></div>
          );
        } else {
          var featuredApplicationArray = this.state.applications.filter(function (app) {
            return app.get('featured');
          });
          var featuredApplications = new ApplicationCollection(featuredApplicationArray);

          var buttonStyle = {
            margin: "auto",
            display: "block"
          };

          var loadingStyle= {
            margin: "0px auto"
          };

          var moreImagesButton = null;
          if(this.state.applications.meta.next){
            if(this.state.isLoadingMoreResults){
              moreImagesButton = (
                <div style={loadingStyle} className="loading"></div>
              );
            }else {
              moreImagesButton = (
                <button style={buttonStyle} className="btn btn-default" onClick={this.onLoadMoreImages}>
                  More Images
                </button>
              );
            }
          }

          content = [
            <ApplicationCardList key="featured" title="Featured Images" applications={featuredApplications}/>,
            <ApplicationCardList key="all" title="All Images" applications={this.state.applications}/>,
            moreImagesButton
          ];
        }

        return (
          <div>
            <SecondaryApplicationNavigation currentRoute="search"/>
            <div className="container application-card-view">
              <ApplicationSearch/>
              {content}
            </div>
          </div>
        );

      }

    });

  });
