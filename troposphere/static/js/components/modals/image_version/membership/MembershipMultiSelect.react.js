import React from 'react';
import Backbone from 'backbone';
import ChosenDropdownMembership from './ChosenDropdownMembership.react';
import ChosenSelectedMembership from './ChosenSelectedMembership.react';
import ChosenMixin from 'components/mixins/ChosenMixinExternal.react';

export default React.createClass({
    displayName: "MembershipMultiSelect",

    mixins: [ChosenMixin],

    propTypes: {
      memberships: React.PropTypes.instanceOf(Backbone.Collection),
      activeModels: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
      onQueryChange: React.PropTypes.func.isRequired,
      onModelAdded: React.PropTypes.func.isRequired,
      onModelRemoved: React.PropTypes.func.isRequired
    },

    getNoResultsPhrase: function(query){
      return 'No memberships found matching "' + query + '". Press enter to create a new membership.';
    },

    getNoDataPhrase: function(){
      return "No memberships exist";
    },

    getAllResultsAddedPhrase: function(){
      return "All memberships have been added";
    },

    getAllAddedMatchingQueryPhrase: function(query){
      return 'All memberships matching "' + query + '" have been added'
    },

    renderModel: function(membership){
      return (
        <ChosenDropdownMembership
          key={membership.id}
          membership={membership}
          propertyName={'name'}
          onMembershipSelected={this.onModelAdded}
        />
      )
    },

    renderSelectedModel: function(membership){
      return (
        <ChosenSelectedMembership
          key={membership.id}
          membership={membership}
          propertyName={'name'}
          onRemoveMembership={this.props.onModelRemoved}
        />
      )
    },
    render: function() {
      return this.renderChosenSearchSelect();
    }
});
