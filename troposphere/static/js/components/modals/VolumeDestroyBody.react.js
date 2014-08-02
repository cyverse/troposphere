/** @jsx React.DOM */

define(
  [
    'react',
    'components/common/Glyphicon.react'
  ],
  function (React, Glyphicon) {

    return {
      build: function(volume){
        return (
          <div>
            {"Your volume "}
            <strong>{volume.get('name')}</strong>
            {" will be destroyed and all data will be permanently lost!"}
          </div>
        );
      }
    }

  });
