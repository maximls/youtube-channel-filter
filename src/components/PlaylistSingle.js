import React from "react";

const PlaylistSingle = props => {
  return (
    <li
      className={
        props.currentPlaylist === props.playlistId
          ? `current-playlist playlist`
          : "playlist"
      }
      onClick={() => props.setCurrentPlaylist(props.playlistId)}
    >
      <h2>{props.playlistName}</h2>
      <img src={`${props.thumbnailURL}`} alt={props.playlistName} />

      <p>{props.numOfVideos} Videos </p>
    </li>
  );
};

export default PlaylistSingle;
