import React, { Component } from "react";
import { YouTubePlayer } from "react-video-players";

class VideoPlayer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    //console.log(`Component updated with: ${this.props.currentPlaylist}`);
  }

  render() {
    if (this.props.currentPlaylist !== "") {
      return (
        <div className="video-player">
          <YouTubePlayer
            config={{
              list: `${this.props.currentPlaylist}`,
              //list: "PLcVoVfBk7xbaDjFeVmriTtaLgCcelyqSO",
              listType: "playlist",
              loop: 1,
              modestbranding: 1,
              rel: 0,
              showinfo: 1
            }}
            playlist={`${this.props.currentPlaylist}`}
            height="100%"
            width="100%"
            play={true}
          />
        </div>
      );
    } else {
      return null;
    }
  }
}

export default VideoPlayer;
