import React from "react";
import { Link } from "react-router";


export default React.createClass({
    displayName: "BadgeMaster",

    render() {
        return (
        <div className="container badges">
            <span className="buttons"><Link to="my-badges"> <div className="btn btn-default"> My Badges </div> </Link> <Link to="unearned-badges"> <div className="btn btn-default"> Unearned Badges </div> </Link> <Link to="all-badges"> <div className="btn btn-default"> All Badges </div> </Link></span>
            {this.props.children}
        </div>
        )
    }
});
