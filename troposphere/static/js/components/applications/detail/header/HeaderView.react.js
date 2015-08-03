
define(
  [
    'react',
    'backbone',
    'jquery',
    'stores',

    // plugins
    'bootstrap'
  ],
  function (React, Backbone, $, stores) {

    return React.createClass({

      propTypes: {
        application: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      componentDidMount: function () {
        var el = this.getDOMNode();
        var $el = $(el).find('.tooltip-wrapper');
        $el.tooltip({
          title: "Coming soon! You'll be able to add frequently used images to projects for even easier launching.",
          placement: "left"
        });
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
              <button className="btn" disabled>
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

            <h1>{this.props.application.get('name')}</h1>
            {addToProjectButton}
          </div>
        );
      }

    });

  });
