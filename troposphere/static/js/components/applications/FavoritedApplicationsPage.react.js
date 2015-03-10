/** @jsx React.DOM */

define(
  [
    'react',
    './common/SecondaryApplicationNavigation.react',
    './list/list/ApplicationCardList.react',
    'stores'
  ],
  function (React, SecondaryApplicationNavigation, ApplicationCardList, stores) {

    function getState() {
      return {
        applications: stores.ApplicationStore.getFavorited(),
        tags: stores.TagStore.getAll()
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
        stores.ApplicationStore.addChangeListener(this.updateState);
        stores.TagStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        stores.ApplicationStore.removeChangeListener(this.updateState);
        stores.TagStore.removeChangeListener(this.updateState);
      },

      render: function () {
        var content;
        if(this.state.applications && this.state.tags) {

          if(this.state.applications.isEmpty()){
            content = (
              <p>You have not favorited any images.  Click the bookmark icon in the top right corner of an image to favorite it.</p>
            );
          } else {
            content = (
              <ApplicationCardList
                applications={this.state.applications}
                tags={this.state.tags}
              />
            );
          }

        }else{
          content = (
            <div className='loading'></div>
          );
        }

        return (
          <div className="container">
            {content}
          </div>
        );
      }

    });

  });
