export default {
    navigateTo: function(url) {
        Backbone.history.navigate(url, {
            trigger: true
        });
    }
}
