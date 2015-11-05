define(function (require) {
    var React = require('react/addons'),
        InteractiveDateField = require('components/common/InteractiveDateField.react'),
        BootstrapModalMixin = require('components/mixins/BootstrapModalMixin.react');


    return React.createClass({

    getInitialState:function(){
        return {
            endDate:""
        }
    },

    handleEndDateChange: function(value) {
        var endDate = value;
        this.setState({endDate: endDate});
    },

    displayName: "ManageUserModal",

    mixins: [BootstrapModalMixin],

    cancel: function(){
        this.hide();
    },

    confirm: function () {
        console.log('A user Action will get called here');
    },

    render: function () {
      var ident_member = this.props.ident_member;

      var content = (
        <div>
            <h4>Manage User End Date</h4>
            <ul>
                <li><b>User Name:</b> {ident_member.get('user').username}</li>
                <li><b>Provider:</b> {ident_member.get('provider').name}</li>
            </ul>
            <p>Input a date to suspend this users account</p>
            <InteractiveDateField
                value={this.state.endDate}
                onChange={this.handleEndDateChange}
            />
        </div>
       );

        return (
          <div className="modal fade">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  {this.renderCloseButton()}
                  <h3>{this.props.header}</h3>
                </div>
                <div className="modal-body">
                    {content}
                </div>
                <div className="modal-footer">
                    <button className="btn btn-default" onClick={this.cancel} >Cancel</button>
                    <button className="btn btn-primary" onClick={this.confirm} >Save Changes</button>
                </div>
              </div>
            </div>
          </div>
        );
      }

    });
});
