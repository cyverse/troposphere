define(function (require) {

  var React = require('react/addons'),
      stores = require('stores'),
      Router = require('react-router');

  return React.createClass({

    mixins: [Router.State],

    getInitialState: function(){
      return {
        username: this.getParams().username
      }
    },

    componentDidMount: function(){
      console.log("just mounted!");
    },
    
    render: function() {
      return (
        <div>
          Users!
        </div>
        );
    }

  });

});
