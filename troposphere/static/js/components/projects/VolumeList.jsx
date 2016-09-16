import React from 'react';
import { MediaCard, MediaCardGroup, Avatar, Div } from 'cyverse-ui';

export default React.createClass({
    volume(item, i) {
        let name = item.get('name');
        let provider = item.get("provider")
        console.log(item);
        return (
            <MediaCard 
                key={ i }
                image={ 
                    <Avatar 
                        size={ 35 }
                        name={ name }
                    /> 
                }
                title={ name } 
                summary={ `${item.get('status')} ${item.get('size')}GB ${provider.name}` }
                contextualMenu = {[
                    {render: "red"},
                    {render: "yellow"},
                    {render: "green"}
                ]}
            />
        )
    },

    render() {
        let { volumes } = this.props;
        return (
            <MediaCardGroup>
                { volumes.map(this.volume) }
            </MediaCardGroup>
        )



    },
});
