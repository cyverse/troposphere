define(function(require){

  var BaseStore = require('stores/BaseStore'),
      InstanceHistoryCollection = require('collections/InstanceHistoryCollection');

  var _isFetchingMore = false;

  var InstanceHistoryStore = BaseStore.extend({
    collection: InstanceHistoryCollection,

    queryParams: {
      page: 1
    },

    fetchMoreInstanceHistory: function () {
      var nextUrl = this.models.meta.next;

      if(nextUrl && !_isFetchingMore){
        _isFetchingMore = true;
        var moreHistory = new InstanceHistoryCollection();
        moreHistory.fetch({
          url: nextUrl
        }).done(function () {
          _isFetchingMore = false;
          this.models.add(moreHistory.models);
          this.models.meta = moreHistory.meta;
          this.emitChange();
        }.bind(this));
      }
    },

    fetchMore: function(){
      this.fetchMoreInstanceHistory();
    }
  });

  var store = new InstanceHistoryStore();

  return store;
});
