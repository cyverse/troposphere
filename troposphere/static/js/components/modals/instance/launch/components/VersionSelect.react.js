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
        var version_id;
        if(this.props.version) {
            version_id = this.props.version.id
        } else {
            version_id = ""
        }
        var options = this.props.versions.map(function (version) {
            return (
              <option key={version.id} value={version.id}>
                {version.get('name')}
              </option>
            );
        });

        return (
          <select value={version_id} id='version' className='form-control' onChange={this.props.onChange}>
            {options}
          </select>

        );
      }

    });

  });
