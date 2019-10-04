import React from 'react';

const SearchTab = (props) => {

    // const click = e => e.target.classList.add('active');
    // const newActive = (tab) => {
    //     const activeItems =  document.getElementsByClassName('ui top')
    //     for (let i = 0 ; i < activeItems[0].childElementCount ; i++) {
    //         activeItems[0].childNodes[i].classList.remove('active');
    //     }

    //     click(tab)
    // }

    return (
        <> 
            <div className="ui top attached tabular menu" >
            
            </div>
            <div className="ui bottom attached active tab segment">
                {props.imageList}
            </div>
            
            
            
        </>
  )
}

export default SearchTab;