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

  if (savedChannels.length === 0) {
    return (
      <div className="empty-channels">
        <h1>Safe YouTube Videos for Kids! - Coming Soon</h1>
      </div>
    );
  } else {
    return (
      <div className="channels-header">
        <h2>Channels</h2>
        <ul className="on-channel-hover saved-channels-list">{savedList}</ul>
      </div>
    );
  }
};

export default ListSavedChannels;
