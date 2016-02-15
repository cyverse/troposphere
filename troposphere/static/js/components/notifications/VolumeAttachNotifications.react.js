import React from 'react';
import globals from 'globals';

let mountVolumeDocumentationUrl = "https://pods.iplantcollaborative.org/wiki/x/OKxm#AttachinganEBSVolumetoanInstance-Step6%3AMountthefilesystemonthepartition.";
let createFileSystemDocumentationUrl = "https://pods.iplantcollaborative.org/wiki/x/OKxm#AttachinganEBSVolumetoanInstance-Step5%3ACreatethefilesystem%28onetimeonly%29.";

export default {
    success: function () {
        var message = (
            <div>
                {'You must '}
                <a href={mountVolumeDocumentationUrl} target="_blank">
                    {'mount the volume'}
                </a>
                {' before you can use it.'}
                <br />
                {'If the volume is new, you will need to '}
                <a href={createFileSystemDocumentationUrl} target="_blank">
                    {'create the file system'}
                </a>
                {' first.'}
            </div>
        );

        return React.renderToString(message);
    },

    error: function () {
        var message = (
        <div>
            {"If this problem persists, contact support at "}
            <a href={`mailto:${globals.SUPPORT_EMAIL}`}>
              {globals.SUPPORT_EMAIL}
            </a>
        </div>
        );

        return React.renderToString(message);
    },

    attachError: function (volume, instance) {
        var volumeName = volume.get('name');
        var instanceName = instance.get('name');

        var message = (
            <div>
                {"Volume '" + volumeName + "' could not be auto-attached to the instance '" + instanceName + "'. "}
                {"Please see "}
            <a href={mountVolumeDocumentationUrl} target="_blank" style={{"textDecoration":"underline"}}>
                {'Mounting a Volume'}
            </a>
                {"in the help documentation to learn how to mount the volume manually"}
            </div>
        );

        return React.renderToString(message);
    }
};
