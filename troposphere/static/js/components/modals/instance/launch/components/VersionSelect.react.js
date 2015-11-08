import React from 'react';
import Backbone from 'backbone';
import ModalMixin from 'components/mixins/modal';

export default React.createClass({
      displayName: "VersionSelect",

      propTypes: {
        version: React.PropTypes.instanceOf(Backbone.Model),
        versions: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        onChange: React.PropTypes.func.isRequired
      },

      render: function () {
        var version_id, options;
        if(this.props.version) {
            version_id = this.props.version.id
            options = this.props.versions.map(function (version) {
                return (
                  <option key={version.id} value={version.id}>
                    {version.get('name')}
                  </option>
                );
            });
        } else {
            version_id = ""
            options = [1].map(function(no_version) {
                return (
                    <option key={1} value={1}>
                      {"No Versions Available. Please choose a different image."}
                    </option>
                );
            });
        }
        return (
          <select value={version_id} id='version' className='form-control' onChange={this.props.onChange}>
            {options}
          </select>

        );
      }
});
