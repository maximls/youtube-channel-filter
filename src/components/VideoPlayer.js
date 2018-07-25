import React from "react";
import { YouTubePlayer } from "react-video-players";

const VideoPlayer = props => {
  if (props.savedChannels.length === 0) {
    return (
      <img
        src="/assets/load-channel-instruction.jpg"
        alt="Load Channel Instructions"
      />
    );
  } else if (props.currentPlaylists === undefined) {
    return (
      <img
        src="/assets/select-channel-instruction.jpg"
        alt="Select Channel Instructions"
      />
    );
  } else if (props.currentPlaylist !== "" || props.currentVideo !== "") {
    let configObj = {};
    if (props.currentVideo !== "") {
      configObj = {
        //videoId: `${props.currentVideo}`,
        loop: 1,
        modestbranding: 1,
        showinfo: 0,
        rel: 0
      };
    } else {
      configObj = {
        list: `${props.currentPlaylist}`,
        listType: "playlist",
        loop: 1,
        modestbranding: 1,
        showinfo: 0,
        rel: 0
      };
    }
    return (
      <div className="video-player">
        <YouTubePlayer
          config={configObj}
          height="100%"
          width="100%"
          play={true}
          videoId={`${props.currentVideo}`}
          playlist={`${props.currentPlaylist}`}
        />
      </div>
    );
  } else {
    return (
      <img
        src="/assets/playlist-instruction.jpg"
        alt=" Playlist Instructions"
      />
    );
  }
};

export default VideoPlayer;
