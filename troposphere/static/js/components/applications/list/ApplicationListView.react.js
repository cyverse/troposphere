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

    function getState() {
      return {
        applications: ApplicationStore.getAll()
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

      helpText: function () {
        return (
          <p>Applications are cool. You are, too. Keep bein' cool, bro.</p>
        );
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

          content = [
            <ApplicationCardList key="featured" title="Featured Images" applications={featuredApplications}/>,
            <ApplicationCardList key="all" title="All Images" applications={this.state.applications}/>
          ];
        }

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
