/** @jsx React.DOM */

define(
  [
    'react',
    'components/mixins/loading',
    'controllers/applications',
    '../list/ApplicationCardList.react'
  ],
  function (React, LoadingMixin, Applications, ApplicationCardList) {

    return React.createClass({
      mixins: [LoadingMixin],

      model: function () {
        return Applications.searchApplications(this.props.query);
      },

      renderContent: function () {
        if (this.state.model.isEmpty()){
          return (
            <div>
              <em>No results found.</em>
            </div>
          );
        }else{
          return (
            <ApplicationCardList applications={this.state.model}/>
          );
        }
      }

    });

  });
