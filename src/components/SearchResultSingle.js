import React from 'react'

const searchResultSingle = (props) => {



    return (
    <div className ="search-result" >
        <img src = {`${props.thumbnailURL}`} />
        <p>{props.description}</p>
        <button onClick = { props.submitted } value = { props.channelId }>Add Channel</button>
    </div>
    )
}


export default searchResultSingle;