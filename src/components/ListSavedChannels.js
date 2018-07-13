import React from "react";

const ListSavedChannels = ({
  savedChannels,
  findPlaylists,
  currentChannel
}) => {
  const savedList = savedChannels.map(e => {
    return (
      <li
        className={
          currentChannel === e[Object.keys(e).join("")].channelID
            ? `current-channel`
            : null
        }
        key={`${e[Object.keys(e).join("")].channelID}`}
        onClick={() => findPlaylists(`${e[Object.keys(e).join("")].channelID}`)}
      >
        <img
          src={e[Object.keys(e).join("")].thumbnailURL}
          alt={`Logo ${e[Object.keys(e).join("")].name}`}
        />
        <h1>{e[Object.keys(e).join("")].name}</h1>
      </li>
    );
  });

  return <ul className="saved-channels-list">{savedList}</ul>;
};

export default ListSavedChannels;
