import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";


export default {
    displayName: "ChosenMixinExternal",

    closeDropdown: function() {
        this.setState({
            showOptions: false
        });
    },

    onEnterOptions: function() {
        this.setState({
            showOptions: true
        });

        $(document).bind("mouseup", this._checkIfApplies);
    },

    _checkIfApplies: function(e) {
        if (this.isOutsideClick(e)) {
            this.onLeaveOptions();
            $(document).unbind("mouseup", this._checkIfApplies);
        }
    },

    onLeaveOptions: function() {
        this.closeDropdown();
    },

    isOutsideClick: function(e) {
        if (!this.isMounted()) {
            return false;
        }

        var node = ReactDOM.findDOMNode(this);
        var $node = $(node);
        var container = $node; //.find('.chosen-container');

        if (!container.is(e.target) // if the target of the click isn't the container...
            && container.has(e.target).length === 0) // ... nor a descendant of the container
        {
            return true;
        }
        return false;
    },

    filterSearchResults: function() {
        let input = this.refs.searchField;
        let query = input.value.trim();
        this.setState({
            query
        });
        this.onQueryChange(query);
    },

    onQueryChange: function(query) {
        this.setState({
            query: query.toLowerCase()
        });
        if(this.props.onQueryChange) {
            this.props.onQueryChange(query);
        }
    },

    clearSearchField: function() {
        let query = "";
        let input = this.refs.searchField;
        input.value = query;
        input.focus();
        this.setState({
            query
        });
        this.onQueryChange(query);
    },

    //
    // Result render helpers
    //

    renderLoadingListItem: function(query) {
        return (
        <li className="no-results">
            Searching for "
            {query}"...
        </li>
        )
    },

    renderNoResultsForQueryListItem: function(query) {
        var phrase = 'No results found matching "' + query + '"';
        if (this.getNoResultsPhrase)
            phrase = this.getNoResultsPhrase(query);
        return <li className="no-results">
                   {phrase}
               </li>;
    },

    renderNoDataListItem: function() {
        var phrase = "No results exist";
        if (this.getNoDataPhrase)
            phrase = this.getNoDataPhrase();
        return <li className="no-results">
                   {phrase}
               </li>;
    },

    //
    // Use ChosenMultiMixinExternal _OR_ ChosenSingleMixinExternal
    // to gain access to a render method.
    //

};


