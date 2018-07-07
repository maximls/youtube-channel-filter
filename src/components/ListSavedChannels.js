import React from "react";
import Async from "react-promise";
import SearchResultSingle from "./SearchResultSingle";

const listSavedChannels = props => {
  const prom = new Promise((resolve, reject) => {
    if (props.apiLoaded) {
      resolve(
        window.gapi.client.youtube.channels.list({
          id: `${props.savedChannelsIds.join(",")}`,
          maxResults: "3",
          part: "snippet",
          fields:
            "items/id, items/snippet/thumbnails/high/url, items/snippet/title"
        })
      );
    } else {
      reject(
        console.log("There was an error sending request - API not loaded")
      );
    }
  })
    .then(
      function(response) {
        return response.result.items.reduce((acc, el, index) => {
          acc[index] = {
            channelId: el.id,
            name: el.snippet.title,
            thumbnailURL: el.snippet.thumbnails.high.url
          };
          return acc;
        }, []);
      },
      function(reason) {
        console.log("Error: " + reason);
      }
    )
    .then(result => {
      return result.map(el => {
        return (
          <SearchResultSingle
            key={el.channelId}
            thumbnailURL={el.thumbnailURL}
            name={el.name}
          />
        );
      });
    });

  return <Async promise={prom} then={value => <div>{value}</div>} />;
};

export default listSavedChannels;
