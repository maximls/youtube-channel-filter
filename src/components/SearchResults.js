import React from "react";
import SearchResultSingle from "./SearchResultSingle";

const searchResults = props => {
  //Check whether the channel is already saved, if so, remove it from local storage. If it's not in the local storage, check if local storage has room (1 of 3 slots) for it and then add to storage.

  const saveSearch = el => {
    if (localStorage.getItem(`channelId - ${el.target.value}`)) {
      localStorage.removeItem(`channelId - ${el.target.value}`);

      props.updateList(el.target.value);
    } else {
      if (localStorage.length < 3) {
        localStorage.setItem(
          `channelId - ${el.target.value}`,
          `${el.target.value}`
        );

        props.updateList(el.target.value);
      } else {
        console.log("Too many channels selected!");
      }
    }
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
