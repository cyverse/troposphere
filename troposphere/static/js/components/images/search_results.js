define(['react', 'components/images/search',
'components/page_header', 'components/mixins/loading', 'rsvp',
'controllers/applications'], function(React, SearchBox, PageHeader,
LoadingMixin, RSVP, Images) {

    var Results = React.createClass({
        mixins: [LoadingMixin],
        model: function() {
            return Images.searchApplications(this.props.query);
        },
        renderContent: function() {
            return React.DOM.ul({},
                this.state.model.map(function(app) {
                    return React.DOM.li({}, app.get('name')); 
                }));
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
