import React from 'react';


const search = (props) => {
    return (
    
    <form onSubmit = {props.click}>
        <input type='text' name='search' style={{color: 'red'}} />
        <button type='submit'>Search</button>
    </form>
)
}

export default search;
