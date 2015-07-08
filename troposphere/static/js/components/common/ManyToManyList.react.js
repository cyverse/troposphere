define(function (require) {

    var React = require('react'),
        Backbone = require('backbone');
    return React.createClass({

        propTypes: {
            renderForm: React.PropTypes.func.isRequired,
            onAddObject: React.PropTypes.func.isRequired,
            onRemoveObject: React.PropTypes.func.isRequired,
            existing_items: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
            title: React.PropTypes.string.isRequired
        },
        renderRow: function (item) {
            return (
                <li className="many-to-many-list-item-choice" key={item.cid}>
                    <span>{item}</span>
                    <a className="many-to-many-list-item-choice-close" onClick={this.onRemoveObject}></a>
                </li>
            )
        },
        //TODO: Potential bug here? React throws: Each child in an array should have a unique "key" prop. Check the renderComponent call using <undefined>.
        //      - See http://fb.me/react-warning-keys for more information.
        //TODO: Warning is Followed by this Error: Uncaught RangeError: Maximum call stack size exceeded
        renderManyToManyList: function() {
            return (
            <div className="many-to-many-list-container">
                <ul className="many-to-many-list">
                {this.props.existing_items.map(this.renderRow)}
              </ul>
            </div>);

        },
        onFormSubmit: function(event) {
            event.preventDefault();
            {this.props.onAddObject(event)}
            return false;
        },
        renderForm: function() {
          return (
          <form onsubmit={this.onFormSubmit}>
              {this.props.renderForm()}
          </form>);
        },
        render: function () {
            return (
                <div className="many-to-many-list-main">
                    <h3 className="many-to-many-list-title">{this.props.title}</h3>
                    <div className="help-block" id="list_help">
                        To remove an item from the list, click the (-) on the RHS of the item.
                        To add a new item to the list, Click the (+) and fill out the form information.
                    </div>
                {this.renderManyToManyList()}
                {this.renderForm()}
                </div>
            );
        }

    });

});
