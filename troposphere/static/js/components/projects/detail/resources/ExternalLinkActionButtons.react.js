import React from 'react';
import Backbone from 'backbone';
import Button from './Button.react';
import actions from 'actions';
import modals from 'modals';


export default React.createClass({
    displayName: "ExternalLinkActionButtons",

    propTypes: {
      multipleSelected: React.PropTypes.bool.isRequired,
      external_link: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      project: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    onDelete: function () {
      this.props.onUnselect(this.props.external_link);
      modals.ExternalLinkModals.destroy({
        external_link: this.props.external_link,
        project: this.props.project
      });
    },

    render: function () {
      var external_link = this.props.external_link,
        linksArray = [];

      linksArray.push(
        <Button
          key="Delete"
          icon="remove"
          tooltip="Delete"
          onClick={this.onDelete}
          isVisible={true}
          />
      );

      return (
        <div style={{borderLeft: "1px solid #ddd", display: "inline-block", paddingLeft: "10px", float: "right"}}>
          {linksArray}
        </div>
      );
    }

});
