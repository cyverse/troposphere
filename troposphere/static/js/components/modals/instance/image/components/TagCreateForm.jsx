import React from 'react';
import RaisedButton from "material-ui/RaisedButton";

export default React.createClass({
    componentDidMount() {
        this.tagDescription.focus();
    },

    render() {
        const {
            isSubmittable,
            createTagAndAddToImage,
            newTagDescription,
            newTagName,
            onNewTagDescriptionChange,
            onNewTagNameChange,

        } = this.props;

        return (
        <div className="form-group clearfix">
            <h3
                style={{
                    marginBottom: "20px"
                }}
                className="t-title"
            >
                Create new tag
            </h3>
            <form>
                <div className="form-group">
                    <label htmlFor="newTagName">Name</label>
                    <input
                        id="newTagName"
                        className="form-control"
                        type="text"
                        onChange={ onNewTagNameChange }
                        value={ newTagName }
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="newTagDescription">Description</label>
                    <textarea
                        ref={(input) => { this.tagDescription = input; }}
                        id="newTagDescription"
                        className="form-control"
                        type="text"
                        onChange={ onNewTagDescriptionChange }
                        value={ newTagDescription }
                    />
                </div>
            </form>
            <RaisedButton
                primary
                disabled={ !isSubmittable() }
                onTouchTap={ createTagAndAddToImage }
                className="pull-right"
                label="Create and add"
            />
        </div>
        );
    },
});
