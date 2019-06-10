import React from "react";

export default ({sortBy, sortOptions, onChangeSort, ...rest}) => (
    <div {...rest} className="pull-right">
        <label style={{marginRight: "10px"}}>Sort By</label>
        <select
            style={{
                background: "none",
                padding: "4px 6px",
                border: "1px solid lightgrey",
                borderRadius: "4px"
            }}
            value={sortBy}
            onChange={onChangeSort}>
            {sortOptions.map(option => (
                <option value={option.value}>{option.label}</option>
            ))}
        </select>
    </div>
);
