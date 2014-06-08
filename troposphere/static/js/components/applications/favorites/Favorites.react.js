/** @jsx React.DOM */

define(
  [
    'react',
    'collections/ApplicationCollection',
    '../list/ApplicationCardList.react',
    'components/common/PageHeader.react'
  ],
  function (React, ApplicationCollection, ApplicationCardList, PageHeader) {

    return React.createClass({

      getInitialState: function () {
        return {
          applications: null
        };
      },

      updateApplications: function (apps) {
        if (this.isMounted()) {
          var favorites = new ApplicationCollection(apps.filter(function (model) {
            return model.get('favorite');
          }));
          this.setState({applications: favorites});
        }
      },

      componentDidMount: function () {
        var apps = new ApplicationCollection();
        apps.on('sync', this.updateApplications);
        apps.fetch();
      },

      componentWillUnmount: function () {
        if (this.state.applications)
          this.state.applications.off('sync', this.updateApplications);
      },

      render: function () {
        var content = (
          <div className='loading'></div>
        );

        if (this.state.applications != null){
          content = (
            <ApplicationCardList applications={this.state.applications}/>
          );
        }

        return (
          <div>
            <PageHeader title="Favorite Images"/>
            {content}
          </div>
        );
      }

    });

  });
