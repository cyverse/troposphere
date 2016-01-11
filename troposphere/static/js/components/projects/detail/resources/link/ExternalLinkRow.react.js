define(function (require) {

  var React = require('react/addons'),
    Backbone = require('backbone'),
    SelectableRow = require('../SelectableRow.react'),
    Name = require('../tableData/link/Name.react'),
    Link = require('../tableData/link/Link.react'),
    stores = require('stores'),
    CryptoJS = require('crypto-js'),
    Gravatar = require('components/common/Gravatar.react');

  return React.createClass({
    displayName: "ExternalLinkRow",

    propTypes: {
      external_link: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      onResourceSelected: React.PropTypes.func.isRequired,
      onResourceDeselected: React.PropTypes.func.isRequired,
      onPreviewResource: React.PropTypes.func.isRequired,
      isPreviewed: React.PropTypes.bool,
      isChecked: React.PropTypes.bool
    },

    render: function () {
      var external_link = this.props.external_link,
        linkHash = CryptoJS.MD5((external_link.id || external_link.cid).toString()).toString(),
        type = stores.ProfileStore.get().get('icon_set'),
        iconSize = 18;

      return (
        <SelectableRow
          isActive={this.props.isPreviewed}
          isSelected={this.props.isChecked}
          onResourceSelected={this.props.onResourceSelected}
          onResourceDeselected={this.props.onResourceDeselected}
          onPreviewResource={this.props.onPreviewResource}
          resource={external_link}
          >
          <td className="image-preview sm-cell" data-label="Name">
            <Name external_link={external_link}/>
          </td>
          <td className="image-preview sm-cell" data-label="Link">
            <Link external_link={external_link}/>
          </td>
        </SelectableRow>
      );
    }

  });

});
