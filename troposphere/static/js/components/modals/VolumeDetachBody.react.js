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
            <p className='alert alert-danger'>
              <Glyphicon name='warning-sign'/>
              <strong>{"WARNING "}</strong>
              {
                "If data is being written to the volume when it's detached, the data may become corrupted. Therefore, " +
                "we recommend you make sure there is no data being written to the volume before detaching it."
              }
            </p>
            <p>
              {"Would you like to detach the volume "}
              <strong>{volume.get('name')}</strong>
              {"?"}
            </p>
            <p>
              <a href="https://pods.iplantcollaborative.org/wiki/x/OKxm#AttachinganEBSVolumetoanInstance-Step7%3AUnmountanddetachthevolume." target="_blank">
              {"Learn more about unmounting and detaching a volume"}
              </a>
            </p>
          </div>
        );
      }
    }

  });
