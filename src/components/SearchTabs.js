import React, { useEffect, useState } from 'react';

const SearchTabs = (props) => {
    return (
        <>
            <div className="ui top attached tabular menu">
                {props.searches.map(search => {
                    return <div className={'item' + (search === props.active ? ' active' : '')} key={search}>{search}</div>
                })}
            </div>

            <div className="ui bottom attached active tab segment">
                
            </div>
        </>
    )
}

export default SearchTabs;