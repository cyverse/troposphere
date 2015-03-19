define(function (require) {

  var React = require('react'),
      ApplicationListCard = require('../common/ApplicationListCard.react');

  return React.createClass({

    propTypes: {
      title: React.PropTypes.string,
      applications: React.PropTypes.instanceOf(Backbone.Collection).isRequired
    },

    renderTitle: function(){
      var title = this.props.title;
      if(!title) return;

      return (
        <h3>{title}</h3>
      )
    },

    renderCard: function(application){
      return (
        <li key={application.id}>
          <ApplicationListCard application={application}/>
        </li>
      );
    },

    render: function () {
      var applications = this.props.applications;
      var appCards = applications.map(this.renderCard);

      return (
        <div>
          {this.renderTitle()}
          <ul className='app-card-list'>
            {appCards}
          </ul>
        </div>
      );
    }

  });

});
