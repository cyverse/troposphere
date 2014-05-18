/** @jsx React.DOM */

define(
  [
    'react',
    'components/page_header',
    'components/common/Glyphicon.react',
    'underscore',
    './ReportInstanceForm.react'
  ],
  function (React, PageHeader, Glyphicon, _, ReportInstanceForm) {

    var ReportInstance = React.createClass({

      componentDidMount: function () {
        if (!this.props.instance)
          this.props.onRequestInstance();
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
        var content;
        if (this.props.instance) {
          content = (
            <div>
              <PageHeader title="Report Instance"/>
              {this.renderIntro()}
              <ReportInstanceForm instance={this.props.instance}/>
            </div>
          );
        } else {
          content = (
            <div className='loading'></div>
          );
        }
        return content;
      }
    });

    return ReportInstance;
  });
