define(function (require) {

  return {
    navigateTo: function(url){
      Backbone.history.navigate(url, {trigger: true});
    }
  }

});
