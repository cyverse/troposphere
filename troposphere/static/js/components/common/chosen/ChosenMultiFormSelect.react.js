define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      ChosenDropdownItem = require('./ChosenDropdownItem.react')
      ChosenSelectedItem = require('./ChosenSelectedItem.react')
      MultiFormMixin = require('components/mixins/MultiFormMixin.react');

  return React.createClass({
    mixins: [MultiFormMixin],

    propTypes: {
      models: React.PropTypes.instanceOf(Backbone.Collection),
      activeModels: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
      propertyName: React.PropTypes.string.isRequired,
      renderCreateForm: React.PropTypes.func.isRequired,
      onQueryChange: React.PropTypes.func.isRequired,
      onModelAdded: React.PropTypes.func.isRequired,
      onModelRemoved: React.PropTypes.func.isRequired
    },

    getNoResultsPhrase: function(query){
      return 'No items found matching "' + query + '". Press enter to create a new item.';
    },

    getNoDataPhrase: function(){
      return "No items exist";
    },

    getAllResultsAddedPhrase: function(){
      return "All items have been added";
    },

    getAllAddedMatchingQueryPhrase: function(query){
      return 'All items matching "' + query + '" have been added'
    },

    renderModel: function(item){
      return (
        <ChosenDropdownItem
          key={item.id}
          item={item}
          propertyName={this.props.propertyName}
          onItemSelected={this.onModelAdded}
        />
      )
    },

    renderSelectedModel: function(item){
      return (
        <ChosenSelectedItem
          key={item.id}
          item={item}
          propertyName={this.props.propertyName}
          onRemoveItem={this.props.onModelRemoved}
        />
      )
    }

  })

});
