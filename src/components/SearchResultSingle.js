import React from "react";

const searchResultSingle = props => {
  console.log(props);
  return (
    <div className="search-result">
      <h1>{props.title}</h1>
      <img src={`${props.thumbnailURL}`} />
      <p>{props.description}</p>
      <button onClick={props.submitted} value={props.channelId}>
        {localStorage.getItem(`channelId - ${props.channelId}`)
          ? `Remove Channel`
          : `Add Channel`}
      </button>
    </div>
  );
};

export default searchResultSingle;
