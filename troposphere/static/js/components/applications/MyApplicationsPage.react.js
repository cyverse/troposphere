/** @jsx React.DOM */

define(
  [
    'react',
    './common/SecondaryApplicationNavigation.react',
    './list/ApplicationCardList.react',
    'stores/ApplicationStore'
  ],
  function (React, SecondaryApplicationNavigation, ApplicationCardList, ApplicationStore) {

    function getState() {
      return {
        applications: ApplicationStore.getCreated()
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

      render: function () {
        var content;
        if(!this.state.applications){
          content = (
            <div className='loading'></div>
          );
        }else if(this.state.applications.isEmpty()){
          content = (
            <p>You have not created any images.  Click the 'image' button on the details page for one of your instances to create an image of it.</p>
          );
        } else {
          content = (
            <ApplicationCardList applications={this.state.applications}/>
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
