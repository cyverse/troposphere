/** @jsx React.DOM */

define(
  [
    'react',
    'components/common/PageHeader.react',
    'collections/applications',
    './ApplicationCardList.react',
    './SearchContainer.react'
  ],
  function (React, PageHeader, Applications, ApplicationCardList, ApplicationSearch) {

    return React.createClass({

      getInitialState: function () {
        return {
          applications: null
        };
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

        if (this.state.applications != null){
          var applicationModels = this.state.applications.filter(function (app) {
            return app.get('featured');
          });
          var applications = new Applications(applicationModels);

          content = [
            <ApplicationCardList title="Featured Images" applications={applications}/>
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
      },

      updateApplications: function (apps) {
        if (this.isMounted())
          this.setState({applications: apps});
      },

      componentDidMount: function () {
        var apps = new Applications();
        apps.on('sync', this.updateApplications);
        apps.on('change', this.forceUpdate.bind(this, null));
        apps.fetch();
      },

      componentWillUnmount: function () {
        if (this.state.applications){
          this.state.applications.off('sync', this.updateApplications);
        }
      }

    });

  });
