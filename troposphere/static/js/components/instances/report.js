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
        return React.DOM.p({className: 'alert alert-info'},
          Glyphicon({name: 'info-sign'}),
          " Is instance ",
          React.DOM.code({}, this.props.instance.get('name_or_id')),
          " exhibiting unexpected behavior? Please read about ",
          React.DOM.a({href: 'https://pods.iplantcollaborative.org/wiki/x/Blm'}, "using instances"),
          " or ",
          React.DOM.a({href: 'https://pods.iplantcollaborative.org/wiki/x/p55y'}, "troubleshooting instances"),
          " for answers to common problems before submitting a request to support staff.");
      },

      render: function () {
        if (this.props.instance)
          return React.DOM.div({},
            PageHeader({title: "Report Instance"}),
            this.renderIntro(),
            ReportInstanceForm({instance: this.props.instance}));
        else
          return React.DOM.div({className: 'loading'});
      }
    });

    return ReportInstance;
  });
