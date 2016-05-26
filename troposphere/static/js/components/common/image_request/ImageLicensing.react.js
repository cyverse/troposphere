import React from 'react';
import Backbone from 'backbone';
import ManyToManyList from 'components/common/ManyToManyList.react';

export default React.createClass({
    displayName: "ImageLicensing",

    propTypes: {
      license_list: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
    },

    addLicenseToList: function (license) {
      var add_list = this.props.license_list;
      add_list.push(license);
      this.setState({license_list: add_list});
    },
    removeLicenseFromList: function (license_id) {
      console.log("Remove", license_id);
    },
    renderForm: function () {
      return (
        <div className="form-group">
          <label htmlFor="title" className="control-label">License Title</label>
          <input type="text" name="license_title" className="form-control" id="license_title"/>
          <label htmlFor="license_type" className="control-label">License Title</label>
          <select value="URL" name="license_type" className="form-control" id="license_type">
            <option value="URL">URL (Hyperlink)</option>
            <option value="text">Full Text</option>
          </select>
          <label htmlFor="text" className="control-label">License Text</label>
          <textarea name="license_text" rows="4"/>
        </div>);
    },
    render: function () {
      if (!this.props.license_list) {
        return (
          <div className="loading"/>
        );
      }
      return (
        <ManyToManyList renderForm={this.renderForm}
                        onAddObject={this.addLicenseToList}
                        onRemoveObject={this.removeLicenseFromList}
                        existing_items={this.props.license_list}
                        title="Image Licensing"/>
      );
    },
});
