import React from "react";

const ListPlaylists = props => {
  const list = props.currentPlaylists.map(e => {
    return (
      <div>
        {" "}
        <li
          className="playlist"
          key={e.playlistId}
          onClick={() => props.setCurrentPlaylist(e.playlistId)}
        >
          <h2>{e.playlistName}</h2>
          <img src={`${e.thumbnailURL}`} alt={e.playlistName} />

          <p>Number of Videos: {e.numOfVideos}</p>
        </li>
      </div>
    );
  });

  return <ul className="playlists saved-channels-list">{list}</ul>;
};

export default ListPlaylists;
