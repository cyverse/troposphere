define(function (require) {
    var React = require('react/addons'),
    BootstrapModalMixin = require('components/mixins/BootstrapModalMixin.react');

    
    return React.createClass({
    displayName: "ManageUserModal",
    
     mixins: [BootstrapModalMixin],
     
     confirm: function () {
         console.log('A user Action will get called here');
     },

     render: function () {

     var content = (
        <div>
            <h4>We can change the user from here!</h4>
            <p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</p>
        </div>
       );

        return (
          <div className="modal fade">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h3>{this.props.header}</h3>
                </div>
                <div className="modal-body">
                {content}
                </div>
                <div className="modal-footer">
                <button className="btn btn-primary" onClick={this.confirm} >Save Changes</button>
                </div>
              </div>
            </div>
          </div>
        );
      }

    });
});
