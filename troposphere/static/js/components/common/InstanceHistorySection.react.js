import React from 'react';
import Backbone from 'backbone';
import stores from 'stores';
import moment from 'moment';

var InstanceHistorySection = React.createClass({
    displayName: "InstanceHistorySection",

    propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    getInitialState: function(){
        return{
            instanceHistory: stores.InstanceHistoryStore.fetchWhere({"instance": this.props.instance.id})
        }
    },

    componentDidMount: function(){
        stores.InstanceHistoryStore.addChangeListener(this.onNewData);
    },

    componentWillUnmount: function(){
        stores.InstanceHistoryStore.removeChangeListener(this.onNewData);
    },

    onNewData: function(){
        this.setState({
            instanceHistory: stores.InstanceHistoryStore.fetchWhere({"instance": this.props.instance.id})
        });
    },

    render: function () {
        var instance = this.props.instance;
        var content, items, deletedInfo;

        if(instance.get('end_date')){
            deletedInfo = (
								<lh>
									<strong>
										{"Deleted on " + moment(instance.get('end_date')).format("MMMM Do YYYY, h:mm a")}
									</strong>
								</lh>
					 );
        }
        if(!this.state.instanceHistory){
            if(stores.InstanceHistoryStore.isFetching){
                content = (
										<div className="loading" />
								);
            }
            else{
                content = (
										<div>
											{"Error loading instance history. Please try again later."}
										</div>
								);
            }
        }
        else{
            items = this.state.instanceHistory.map(function(historyItem){
                let formattedStartDate = moment(historyItem.get('start_date')).format("MMMM Do YYYY, h:mm a"),
                    formattedEndDate = "Present";
                if(historyItem.get('end_date') && historyItem.get('end_date').isValid()){
                    formattedEndDate = moment(historyItem.get('end_date')).format("MMMM Do YYYY, h:mm a");
                }
                return <div key={historyItem.cid}>{historyItem.get('status')}: {formattedStartDate} - {formattedEndDate}</div>;
            });
            content =
                (
                    <ul>
                        {deletedInfo}
                        {items}
                    </ul>
                );
        }
        return (
          <div className="resource-details-section section">
            <h4 className="t-title">Instance Status History</h4>
            {content}
          </div>
        );
    }

});

export default InstanceHistorySection;
