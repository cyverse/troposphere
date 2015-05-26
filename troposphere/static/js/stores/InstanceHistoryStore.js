define(function(require){

  var BaseStore = require('stores/BaseStore'),
      InstanceHistoryCollection = require('collections/InstanceHistoryCollection');

  var _isFetchingMore = false;

  var InstanceHistoryStore = BaseStore.extend({

    // todo: the only thing different between this and the base class is the page_size query param
    fetchModels: function () {
      if(!this.isFetching) {
        this.isFetching = true;
        var instances = new InstanceHistoryCollection();
        instances.fetch({
          url: instances.url + "?page=1"
        }).done(function () {
          this.isFetching = false;
          this.models = instances;
          this.emitChange();
        }.bind(this));
      }
    },

    fetchMoreInstanceHistory: function () {
      var nextUrl = this.models.meta.next;

      if(nextUrl && !_isFetchingMore){
        _isFetchingMore = true;
        var moreHistory = new InstanceHistoryCollection();
        moreHistory.fetch({url: nextUrl}).done(function () {
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

  var store = new InstanceHistoryStore(null, {
    collection: InstanceHistoryCollection
  });

  return store;
});
