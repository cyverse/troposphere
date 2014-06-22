/** @jsx React.DOM */

define(
  [
    'react',
    './header/HeaderView.react',
    './availability/AvailabilityView.react',
    './tags/TagsView.react',
    '../common/ApplicationCard.react',
    './description/DescriptionView.react',
    './versions/VersionsView.react',
    'actions/InstanceActions'
  ],
  function (React, HeaderView, AvailabilityView, TagsView, ApplicationCard, DescriptionView, VersionsView, InstanceActions) {

    return React.createClass({

      propTypes: {
        application: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      showModal: function (e) {
        InstanceActions.launch(this.props.application);
      },

      render: function () {
        return (
          <div id='app-detail'>
            <ApplicationCard application={this.props.application} onLaunch={this.showModal}/>

            <HeaderView application={this.props.application}/>
            <TagsView application={this.props.application}/>
            <AvailabilityView application={this.props.application}
                              providers={this.props.providers}
            />
            <DescriptionView application={this.props.application}/>
            <VersionsView application={this.props.application}/>
          </div>
        );
      }

    });

  });
