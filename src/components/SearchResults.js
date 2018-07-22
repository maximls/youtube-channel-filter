import React from "react";
import SearchResultSingle from "./SearchResultSingle";
import Alert from "react-s-alert";
import { numOfChannels } from "../config";

const searchResults = props => {
  //First check if the channel has any playlists
  //Check whether the channel is already saved, if so, remove it from local storage. If it's not in the local storage, check if local storage has room (numOfChannels in config.js) for it and then add to storage.

  const saveSearch = el => {
    el.persist();
    new Promise((resolve, reject) => {
      resolve(
        window.gapi.client.youtube.playlists.list({
          channelId: `${el.target.value}`,
          part: "id",
          maxResults: 1,
          fields: "items/id"
        })
      );
      reject(reason => console.log("Didn't work", reason));
    }).then(results => {
      if (results.result.items.length > 0) {
        const obj = savedChannelObj(el.target.value);
        if (localStorage.getItem(`channelId - ${el.target.value}`)) {
          localStorage.removeItem(`channelId - ${el.target.value}`);
          props.updateList(obj);
        } else {
          if (
            Object.keys(localStorage).filter(e => e.includes("channelId"))
              .length < numOfChannels
          ) {
            localStorage.setItem(
              `channelId - ${el.target.value}`,
              `${JSON.stringify(obj)}`
            );
            props.updateList(obj);
          } else {
            Alert.error("Too many channels selected!");
          }
        }
      } else {
        Alert.error(
          "This channel has no playlist/videos. Please select a different channel.",
          { timeout: 3000 }
        );
      }
    });
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
      {props.nextPageState !== undefined && props.nextPageState !== "" ? (
        <span onClick={() => props.paginate("next")}>Next</span>
      ) : null}
      <br />
      {props.prevPageState !== undefined && props.prevPageState !== "" ? (
        <span onClick={() => props.paginate("prev")}>Prev</span>
      ) : null}
      {props.searchResults.map(result => {
        return (
          <SearchResultSingle
            key={result.channelId}
            thumbnailURL={result.thumbnailURL}
            description={result.description}
            channelId={result.channelId}
            title={result.name}
            submitted={saveSearch}
          />
        );
      })}
    </div>
  );
};

export default searchResults;
