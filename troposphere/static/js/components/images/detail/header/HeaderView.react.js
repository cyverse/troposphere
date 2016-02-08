
define(
  [
    'react/addons',
    'backbone',
    'jquery',
    'stores',
    'modals'
  ],
  function (React, Backbone, $, stores, modals) {

    return React.createClass({
      displayName: "HeaderView",

      propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      componentDidMount: function () {
        var el = this.getDOMNode();
        var $el = $(el).find('.tooltip-wrapper');
        $el.tooltip({
          title: "NEW! You can now add an Image to your project to make launching instances even easier!",
          placement: "left"
        });
      },

      showAddProjectModal: function (e) {
        e.preventDefault(); // Do i need this?
        modals.ProjectModals.addImage(this.props.image);
      },

      onReturnToPreviousPage: function (e) {
        e.preventDefault();
        Backbone.history.history.back();
      },

      render: function () {
        var profile = stores.ProfileStore.get(),
          addToProjectButton;


        if (profile.id) {
          addToProjectButton = (
            <div className="tooltip-wrapper" style={{display: "inline-block", float: "right"}}>
              <button className="btn" onClick={this.showAddProjectModal} >
                <i className='glyphicon glyphicon-plus'></i>
                Add to Project
              </button>
            </div>
          );
        }

        return (
          <div className='image-header'>
            <a className='nav-back btn btn-default' onClick={this.onReturnToPreviousPage}>
              <span className='glyphicon glyphicon-arrow-left'>{''}</span>
            </a>
            <h1>{this.props.image.get('name')}</h1>
            {addToProjectButton}
          </div>
        );
      }

    });

});
