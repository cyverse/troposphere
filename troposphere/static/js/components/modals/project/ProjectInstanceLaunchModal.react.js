/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/mixins/BootstrapModalMixin.react',
    'stores',
    './instance_launch/ImageList.react'
  ],
  function (React, Backbone, BootstrapModalMixin, stores, ImageList) {

    return React.createClass({
      mixins: [BootstrapModalMixin],

      //
      // Mounting & State
      // ----------------
      //

      getInitialState: function(){
        return this.getState();
      },

      getState: function() {
        return {
          images: stores.ApplicationStore.getAll()
        }
      },

      updateState: function () {
        if (this.isMounted()) this.setState(this.getState());
      },

      componentDidMount: function () {
        stores.ApplicationStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        stores.ApplicationStore.removeChangeListener(this.updateState);
      },

      //
      // Internal Modal Callbacks
      // ------------------------
      //

      cancel: function(){
        this.hide();
      },

      confirm: function () {
        this.hide();
        this.props.onConfirm();
      },


      //
      // Render
      // ------
      //

      renderImage: function(){
        return(
          <li></li>
        )
      },

      renderImageList: function(){
        return(
          <ul>
            {this.state.images.map(this.renderImage)}
          </ul>
        )
      },

      renderBody: function(){
        var images = this.state.images;

        if(images){
          return (
            <div>
              <input/>
              <ImageList images={images}/>
            </div>
          );
        }

        return (
          <div>
            <input/>
            <div className="loading"/>
          </div>
        );
      },

      render: function () {
        return (
          <div className="modal fade">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  {this.renderCloseButton()}
                  <strong>Launch Image</strong>
                </div>
                <div className="modal-body">
                  {this.renderBody()}
                </div>
              </div>
            </div>
          </div>
        );
      }

    });

  });
