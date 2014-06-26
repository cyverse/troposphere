/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/common/PageHeader.react',
    'components/common/Glyphicon.react',
    './ReportInstanceForm.react'
  ],
  function (React, Backbone, PageHeader, Glyphicon, ReportInstanceForm) {

    return React.createClass({

      propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      renderIntro: function () {
        return (
          <p className="alert alert-info">
            <Glyphicon name="info-sign"/>
            {" Is instance "}
            <code>{this.props.instance.get('name_or_id')}</code>
            {" exhibiting unexpected behavior? Please read about "}
            <a href="https://pods.iplantcollaborative.org/wiki/x/Blm">using instances</a>
            {" or "}
            <a href="https://pods.iplantcollaborative.org/wiki/x/p55y">troubleshooting instances</a>
            {" for answers to common problems before submitting a request to support staff."}
          </p>
        );
      },

      render: function () {
        return (
          <div>
            <PageHeader title="Report Instance"/>
            {this.renderIntro()}
            <ReportInstanceForm instance={this.props.instance}/>
          </div>
        );
      }
    });

  });
