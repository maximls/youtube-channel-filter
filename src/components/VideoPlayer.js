import React from "react";
import { YouTubePlayer } from "react-video-players";

const VideoPlayer = props => {
  if (props.currentPlaylist !== "" || props.currentVideo !== "") {
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
    return <img src="/assets/init-image.jpg" alt="Instructions" />;
  }
};

export default VideoPlayer;
