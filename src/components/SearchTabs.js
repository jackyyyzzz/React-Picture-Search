import React, { useEffect, useState } from 'react';

const SearchTabs = (props) => {
    
    return (
        <>
            <div className="ui top attached tabular menu" >
                {props.searches.map(search => {
                    return (
                        <div 
                            className={'item' + (search === props.activeTab ? ' active' : '')} 
                            key={search} 
                            onClick={props.setActiveTab}
                            style={{ cursor: 'pointer' }}
                            >
                            
                            {search}
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