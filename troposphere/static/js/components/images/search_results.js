define(['react', 'components/images/search',
'components/page_header', 'components/mixins/loading', 'rsvp',
'controllers/applications', 'components/images/cards'], function(React,
SearchBox, PageHeader, LoadingMixin, RSVP, Images, Cards) {

    var Results = React.createClass({
        mixins: [LoadingMixin],
        model: function() {
            return Images.searchApplications(this.props.query);
        },
        renderContent: function() {
            return Cards.ApplicationCardList({applications: this.state.model});
        }
    });

    var SearchResults = React.createClass({
        render: function() {
            return React.DOM.div({}, 
                PageHeader({title: "Image Search"}),
                SearchBox({query: this.props.query}),
                Results({query: this.props.query}))
        }
    });

    return SearchResults;

});
