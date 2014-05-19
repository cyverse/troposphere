define(
  [
    'react',
    'components/applications/SearchContainer.react',
    'components/PageHeader.react',
    'components/mixins/loading',
    'rsvp',
    'controllers/applications',
    'components/applications/cards',
    './Results.react'
  ], function (React, SearchBox, PageHeader, LoadingMixin, RSVP, Applications, Cards, Results) {

    var SearchResults = React.createClass({
      render: function () {
        return React.DOM.div({},
          PageHeader({title: "Image Search"}),
          SearchBox({query: this.props.query}),
          Results({query: this.props.query}))
      }
    });

    return SearchResults;

  });
