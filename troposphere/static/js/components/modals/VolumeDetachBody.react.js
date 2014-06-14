/** @jsx React.DOM */

define(
  [
    'react',
    'components/common/Glyphicon.react'
  ],
  function (React, Glyphicon) {

    return {
      build: function(){
        return (
          <div>
            <p className='alert alert-danger'>
              <Glyphicon name='warning-sign'/>
              <strong>{"WARNING "}</strong>
              {"If this volume is mounted, you "}
              <em>{"must "}</em>
              {"stop any running processes that are writing to the mount location before you can detach."}
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
