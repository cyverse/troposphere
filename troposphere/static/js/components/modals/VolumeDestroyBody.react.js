/** @jsx React.DOM */

define(
  [
    'react',
    'components/common/Glyphicon.react'
  ],
  function (React, Glyphicon) {

    return {
      build: function(volume){
        var volumeName = volume.get('name');
        return (
          <div>
            <p>
              {"Are you sure you want to delete the volume "}
              <strong>{volumeName}</strong>
              {"?"}
            </p>
            <p>
              {"The volume will be destroyed and "}
              <strong style={{"text-decoration":"underline"}}>all data will be permanently lost</strong>
              {"."}
            </p>
          </div>
        );
      }
    }

  });
