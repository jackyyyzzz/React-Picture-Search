import React, { useEffect, useState } from 'react';

const SearchTabs = (props) => {
    if (props.searches && props.searches.length === 0) return null;

    return (
        <>
            <div className="ui top attached tabular menu" >
                {props.searches.map(search => {
                    return (
                        <div 
                            className={'item' + (search === props.activeTab ? ' active' : '')} 
                            key={search} 
                            onClick={search !== props.activeTab ? props.setActiveTab : null}
                            style={{ cursor: 'pointer' }}
                            data-search-term={search}
                            >
                            
                            {search}
                            <button onClick={props.closeTab} data-button-type="close">x</button>
                        </div>
                    )}
                )}
                
            </div>

            <div className="ui bottom attached active tab segment" >
                {props.imageList}
            </div>
        </>
    )
}

export default SearchTabs;