import React from 'react';
import ReactDOM from 'react-dom';
import globals from 'globals';


export default {
    success: function (helpLink) {
        var message = (
            <div>
                {'You must '}
                <a href={helpLink.get('href')} target="_blank">
                    {'mount the volume'}
                </a>
                {' before you can use it.'}
                <br />
                {'If the volume is new, you will need to '}
                <a href={helpLink.get('href')} target="_blank">
                    {'create the file system'}
                </a>
                {' first.'}
            </div>
        );

        return ReactDOM.renderToString(message);
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

        return ReactDOM.renderToString(message);
    },

    attachError: function (volume, instance, helpLink) {
        var volumeName = volume.get('name');
        var instanceName = instance.get('name');

        var message = (
            <div>
                {"Volume '" + volumeName + "' could not be auto-attached to the instance '" + instanceName + "'. "}
                {"Please see "}
            <a href={helpLink.get('href')} target="_blank" style={{"textDecoration":"underline"}}>
                {'Mounting a Volume'}
            </a>
                {"in the help documentation to learn how to mount the volume manually"}
            </div>
        );

        return ReactDOM.renderToString(message);
    }
};
