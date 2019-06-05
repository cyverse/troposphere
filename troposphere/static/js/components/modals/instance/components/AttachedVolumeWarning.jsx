import React from "react";
import Glyphicon from "components/common/Glyphicon";

const AttachedVolumeWarning = ({volumes}) => (
    <p className="alert alert-warning">
        <Glyphicon name="warning-sign" /> <strong>Alert:</strong>
        {` You have a volume attached (${volumes.map(volume =>
            volume.get("name")
        )}). Volumes must be detached before performing this action.`}
    </p>
);

export default AttachedVolumeWarning;
