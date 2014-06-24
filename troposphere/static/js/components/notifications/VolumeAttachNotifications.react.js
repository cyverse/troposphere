/** @jsx React.DOM */

define(
  [
    'react'
  ],
  function (React) {

    return {
      success: function(){
        var mountVolumeDocumentationUrl = "https://pods.iplantcollaborative.org/wiki/x/OKxm#AttachinganEBSVolumetoanInstance-Step6%3AMountthefilesystemonthepartition.";
        var createFileSystemDocumentationUrl = "https://pods.iplantcollaborative.org/wiki/x/OKxm#AttachinganEBSVolumetoanInstance-Step5%3ACreatethefilesystem%28onetimeonly%29.";
        var message = (
          <div>
            {'You must '}
            <a href={mountVolumeDocumentationUrl} target="_blank">
              {'mount the volume'}
            </a>
            {'you before you can use it.'}
            <br />
            {'If the volume is new, you will need to '}
            <a href={createFileSystemDocumentationUrl} target="_blank">
              {'create the file system'}
            </a>
            {' first.'}
          </div>
        );

        return React.renderComponentToString(message);
      },

      error: function(){
        var message = (
          <div>
            {"If this problem persists, contact support at "}
            <a href="mailto:support@iplantcollaborative.org">
              {"support@iplantcollaborative.org"}
            </a>
          </div>
        );

        return React.renderComponentToString(message);
      }
    }

  });
