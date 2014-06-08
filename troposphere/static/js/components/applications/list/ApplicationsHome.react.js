/** @jsx React.DOM */

define(
  [
    'react',
    'components/common/PageHeader.react',
    'collections/ApplicationCollection',
    './ApplicationCardList.react',
    './SearchContainer.react',
    'stores/ApplicationStore'
  ],
  function (React, PageHeader, ApplicationCollection, ApplicationCardList, ApplicationSearch, ApplicationStore) {

    function getApplicationState() {
        return {
          applications: ApplicationStore.getAll(),
          loading: !ApplicationStore.isSynced()
        };
    }

    return React.createClass({

      getInitialState: function () {
        return getApplicationState();
      },

      updateApps: function () {
        if (this.isMounted())
          this.setState(getApplicationState());
      },

      componentDidMount: function () {
        ApplicationStore.addChangeListener(this.updateApps);
      },

      componentDidUnmount: function () {
        ApplicationStore.removeChangeListener(this.updateApps);
      },

      helpText: function () {
        return (
          <p>Applications are cool. You are, too. Keep bein' cool, bro.</p>
        );
      },

      render: function () {
        var content = (
          <div className="loading"></div>
        );

        if (!this.state.loading){
          var applicationModels = this.state.applications.filter(function (app) {
            return app.get('featured');
          });
          var featured = new ApplicationCollection(applicationModels);

          content = [
            <ApplicationCardList key="featured" title="Featured Images" applications={featured}/>,
            <ApplicationCardList key="all" title="All Images" applications={this.state.applications}/>
          ];
        }

        // todo: Add ability for user to toggle display mode and then put this back in the code
        //  <div className='view-selector'>
        //    {'View:'}
        //    <a className='btn btn-default'>
        //      <span className='glyphicon glyphicon-th'>{''}</span>
        //    </a>
        //    <a className='btn btn-default'>
        //      <span className='glyphicon glyphicon-th-list'>{''}</span>
        //    </a>
        //  </div>

        return (
          <div>
            <PageHeader title='Images' helpText={this.helpText}/>
            <ApplicationSearch/>
            {content}
          </div>
        );
      }

    });

  });
