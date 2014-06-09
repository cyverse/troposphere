/** @jsx React.DOM */

define(
  [
    'react',
    'components/common/PageHeader.react',
    './list/ApplicationCardList.react',
    'stores/ApplicationStore'
  ],
  function (React, PageHeader, ApplicationCardList, ApplicationStore) {

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

      componentDidUnmount: function () {
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
            <PageHeader title="My Images"/>
            {content}
          </div>
        );
      }

    });

  });
