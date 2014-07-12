/** @jsx React.DOM */

define(
  [
    'react',
    'components/projects/instanceDetails/sections/details/Id.react',
    'components/projects/instanceDetails/sections/details/Status.react'
  ],
  function (React, Id, Status) {

    return React.createClass({

      //
      // Mounting & State
      // ----------------
      //

      propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      //
      // Render
      // ------
      //

      render: function () {
        return (
          <ul>
            <Id instance={this.props.instance}/>
            <Status instance={this.props.instance}/>
            <li>
              <span>Instance</span>
              <span>Preview</span>
            </li>
          </ul>
        );
      }

    });

  });
