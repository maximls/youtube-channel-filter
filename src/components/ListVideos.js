import React from "react";
import InfiniteScroll from "react-infinite-scroller";

const ListVideos = ({
  currentVideos,
  playVideo,
  currentPlaylist,
  currentVideo
}) => {
  let list = [];
  let errorMessage;
  if (currentVideos !== undefined) {
    list = currentVideos.map(video => {
      return (
        <li
          key={`${video.videoId}`}
          onClick={() => playVideo(video.videoId)}
          className={currentVideo === video.videoId ? "current-video" : null}
        >
          <img src={`${video.thumbnailURL}`} alt={`${video.title}`} />
          <h2>{video.title}</h2>
        </li>
      );
    });
  } else {
    return null;
  }

  // if (currentPlaylist === "") {
  //   errorMessage = "Select a Playlist to Play Videos";
  // } else if (currentVideos.length === 0) {
  //   errorMessage = "Sorry, No Videos Found. Try a different playlist.";
  // }

  return (
    <div>
      <h2 className="videos-section-header">Videos</h2>
      {currentVideos.length !== 0 ? (
        <InfiniteScroll element="ul" className="playlist-videos scroll">
          {list}
        </InfiniteScroll>
      ) : (
        <div className="empty-videos playlist-videos scroll" />
      )}
    </div>
  );
};

export default ListVideos;
