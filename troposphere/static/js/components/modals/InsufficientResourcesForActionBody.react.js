/** @jsx React.DOM */

define(
  [
    'react',
    'components/common/Glyphicon.react'
  ],
  function (React, Glyphicon) {

    return {
      build: function () {
        return (
          <div>
            <p className='alert alert-error'>
              <Glyphicon name='ban-circle'/>
              {" "}
              <strong>Cannot resume instance</strong>
              {
                " You do not have enough resources to resume this instance. You must terminate, suspend, " +
                "or stop another running instance, or request more resources."
              }
            </p>
          </div>
        );
      }
    }

  });
