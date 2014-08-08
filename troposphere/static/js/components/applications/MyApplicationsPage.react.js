/** @jsx React.DOM */

define(
  [
    'react',
    './common/SecondaryApplicationNavigation.react',
    './list/ApplicationCardList.react',
    'stores/ApplicationStore',
    'stores/TagStore'
  ],
  function (React, SecondaryApplicationNavigation, ApplicationCardList, ApplicationStore, TagStore) {

    function getState() {
      return {
        applications: ApplicationStore.getCreated(),
        tags: TagStore.getAll()
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
        TagStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        ApplicationStore.removeChangeListener(this.updateState);
        TagStore.removeChangeListener(this.updateState);
      },

      render: function () {
        var content;
        if(this.state.applications && this.state.tags){
          if(this.state.applications.isEmpty()){
            content = (
              <p>You have not created any images.  Click the 'image' button on the details page for one of your instances to create an image of it.</p>
            );
          } else {
            content = (
              <ApplicationCardList applications={this.state.applications}
                                   tags={this.state.tags}
              />
            );
          }
        }else {
          content = (
            <div className='loading'></div>
          );
        }

        return (
          <div>
            <SecondaryApplicationNavigation currentRoute="my images"/>
            <div className="container">
              {content}
            </div>
          </div>
        );
      }

    });

  });
