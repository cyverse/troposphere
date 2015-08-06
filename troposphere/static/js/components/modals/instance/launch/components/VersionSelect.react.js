/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/mixins/modal'
  ],
  function (React, Backbone, ModalMixin) {

    return React.createClass({
      displayName: "VersionSelect",

      propTypes: {
        version: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        versions: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        onChange: React.PropTypes.func.isRequired
      },

      render: function () {
        var version_name;
        if(this.props.version) {
            version_name = this.props.version.get('name')
        } else {
            version_name = ""
        }
        var options = this.props.versions.map(function (version) {
          if(version.id == this.props.version.id) {
            return (
              <option key={version.id} value={version.id} selected>
                {version.get('name')}
              </option>
            );
          } else {
            return (
              <option key={version.id} value={version.id}>
                {version.get('name')}
              </option>
            );
          }
        }.bind(this));

        return (
          <select value={version_name} id='version' className='form-control' onChange={this.props.onChange}>
            {options}
          </select>

        );
      }

    });

  });
