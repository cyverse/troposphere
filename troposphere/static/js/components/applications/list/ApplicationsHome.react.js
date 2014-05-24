/** @jsx React.DOM */

define(
  [
    'react',
    'components/common/PageHeader.react',
    'collections/applications',
    './ApplicationCardList.react',
    './SearchContainer.react',
    'stores/applications'
  ],
  function (React, PageHeader, Applications, ApplicationCardList, ApplicationSearch, AppStore) {

    function getApplicationState() {
        return {
          applications: AppStore.getAll(),
          loading: !AppStore.isSynced()
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
        AppStore.addChangeListener(this.updateApps);
      },

      componentDidUnmount: function () {
        AppStore.removeChangeListener(this.updateApps);
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
          var applications = new Applications(applicationModels);

          content = [
            <ApplicationCardList key="featured" title="Featured Images" applications={applications}/>
          ];
        }

        return (
          <div>
            <PageHeader title='Images' helpText={this.helpText}/>
            <ApplicationSearch/>
            <div className='view-selector'>
              {'View:'}
              <a className='btn btn-default'>
                <span className='glyphicon glyphicon-th'>{''}</span>
              </a>
              <a className='btn btn-default'>
                <span className='glyphicon glyphicon-th-list'>{''}</span>
              </a>
            </div>
            {content}
          </div>
        );
      }

    });

  });
