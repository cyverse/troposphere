define(
  [
    'react',
    'backbone',
    'underscore',
    'components/mixins/modal'
  ],
  function (React, Backbone, _, ModalMixin) {

    var ConfirmComponent = React.createClass({
      mixins: [ModalMixin],
      getDefaultProps: function () {
        return {
          okButtonText: 'OK',
          //onCancel: function() {},
        };
      },

      onConfirm: function () {
        if (this.props.onConfirm)
          this.props.onConfirm().then(function () {
            this.close();
          }.bind(this));
        else
          this.close();
      },

      renderTitle: function () {
        return this.props.title;
      },

      renderBody: function () {
        return this.props.body;
      },

      renderFooter: function () {
        return React.DOM.div({},
          React.DOM.button({
            className: 'btn btn-primary',
            onClick: this.onConfirm
          }, this.props.okButtonText));
      }

    });

    var mountModal = function (modalComponent) {
      React.renderComponent(modalComponent, document.getElementById('modal'));
    };

    /* 
     * Options:
     * onConfirm: Promise to execute if user confirms modal.
     * okButtonText: Alternate text for 'ok' button on modal. 
     */
    var doAlert = function (header, body, options) {
      var props = {
        title: header,
        body: body
      };

      _.extend(props, options);
      var component = ConfirmComponent(props);
      mountModal(component);
    };

    return {
      alert: doAlert,
      show: mountModal
    };
  });
