import React from "react";
import PlaylistSingle from "./PlaylistSingle";
import InfiniteScroll from "react-infinite-scroller"; //http://cassetterocks.github.io/react-infinite-scroller/

const ListPlaylists = props => {
  let list = [];
  if (props.currentPlaylists !== undefined) {
    list = props.currentPlaylists.map(e => {
      if (e.numOfVideos >= 1 && props.currentChannel !== "") {
        return (
          <PlaylistSingle
            key={e.playlistId}
            {...e}
            currentPlaylist={props.currentPlaylist}
            setCurrentPlaylist={props.setCurrentPlaylist}
            highlightPlaylistId={props.highlightPlaylistId}
          />
        );
      }
    });
  } else {
    return (
      <div>
        <h2 className="playlists-section-header">Playlists</h2>
        <div className="empty-playlists playlists scroll" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="playlists-section-header">Playlists</h2>

      <InfiniteScroll element="ul" className="playlists scroll">
        {list}
      </InfiniteScroll>
    </div>
  );
};

export default ListPlaylists;
