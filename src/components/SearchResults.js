import React from "react";
import SearchResultSingle from "./SearchResultSingle";

const searchResults = props => {
  //Check whether the channel is already saved, if so, remove it from local storage. If it's not in the local storage, check if local storage has room (1 of 3 slots) for it and then add to storage.

  const saveSearch = el => {
    const obj = savedChannelObj(el.target.value);
    if (localStorage.getItem(`channelId - ${el.target.value}`)) {
      localStorage.removeItem(`channelId - ${el.target.value}`);
      props.updateList(obj);
    } else {
      if (
        Object.keys(localStorage).filter(e => e.includes("channelId")).length <
        3
      ) {
        localStorage.setItem(
          `channelId - ${el.target.value}`,
          `${JSON.stringify(obj)}`
        );
        props.updateList(obj);
      } else {
        console.log("Too many channels selected!");
      }
    }
  };

  const savedChannelObj = currentChannelId => {
    const array = props.searchResults.filter(
      el => el.channelId === currentChannelId
    );
    return {
      [currentChannelId]: {
        etag: array[0].etag,
        channelID: array[0].channelId,
        name: array[0].name,
        description: array[0].description,
        thumbnailURL: array[0].thumbnailURL
      }
    };
  };

  return (
    <div>
      {props.searchResults.map(result => {
        return (
          <SearchResultSingle
            key={result.channelId}
            thumbnailURL={result.thumbnailURL}
            description={result.description}
            channelId={result.channelId}
            submitted={saveSearch}
          />
        );
      })}
    </div>
  );
};

export default searchResults;
