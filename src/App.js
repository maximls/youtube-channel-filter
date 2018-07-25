import React, { Component } from "react";
import { BrowserRouter, Route, NavLink } from "react-router-dom";
import Alert from "react-s-alert";
import { key, restrict } from "./config";
import "./App.css";
import "react-s-alert/dist/s-alert-default.css";
import "react-s-alert/dist/s-alert-css-effects/scale.css";
import "react-s-alert/dist/s-alert-css-effects/jelly.css";
import Aux from "./hoc/Wrap";
import ManageChannels from "./containers/ManageChannels";
import ListSavedChannels from "./components/ListSavedChannels";
import ListPlaylists from "./components/ListPlaylists";
import VideoPlayer from "./components/VideoPlayer";
import ListVideos from "./components/ListVideos";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiLoaded: false,
      savedChannels: {},
      currentChannel: ``,
      currentPlaylists: [],
      currentPlaylist: ``,
      channelResults: [],
      currentVideos: [],
      currentSearch: "",
      playVideo: "",
      prevChannelPage: "",
      nextChannelPage: "",
      searchOpen: false
    };
  }

  componentWillMount() {
    //readyAPI() checks whether .youtube was loaded every 0.2 sec and once loaded, sets state.
    const readyApi = () => {
      if (window.gapi.client.youtube === undefined) {
        window.setTimeout(function() {
          readyApi();
        }, 100);
      } else {
        this.setState({ apiLoaded: true });
        return;
      }
    };

    //Load API
    window.gapi.load("client", {
      callback: () => {
        window.gapi.client
          .init({
            apiKey: key,
            discoveryDocs: [
              "https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"
            ]
          })
          .then(
            //readyAPI() is used to ensure that the .youtube library is loaded. The init function only checks for gapi.client load.
            readyApi(),
            () => console.log("Error initializing gapi clilent - check API key")
          );
      },
      onerror: () => {
        // Handle loading error.
        console.log("gapi.client failed to load!");
      },
      timeout: 5000, // 5 seconds.
      ontimeout: function() {
        // Handle timeout.
        alert("gapi.client could not load in a timely manner!");
      }
    });

    //Sync local storage with state on channel list updates
    const localStorageChannels = [];

    Object.keys(localStorage)
      .filter(e => e.includes("channelId"))
      .forEach(e => {
        localStorageChannels.push(JSON.parse(localStorage.getItem(e)));
      });

    this.setState({ savedChannels: localStorageChannels });

    let localStorageCurrChannel = "";

    Object.keys(localStorage)
      .filter(e => e.includes("currChannelId"))
      .forEach(e => {
        localStorageCurrChannel = JSON.parse(localStorage.getItem(e));
      });

    this.setState({ currentChannel: localStorageCurrChannel });
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   //console.log(nextProps, nextState);
  //   console.log(this.state.apiLoaded !== nextProps.apiLoaded);
  //   return this.state.apiLoaded !== nextProps.apiLoaded ? false : false;
  // }

  componentDidMount() {
    const checkAPI = () => {
      if (!this.state.apiLoaded) {
        window.setTimeout(() => {
          checkAPI();
        }, 100);
      } else {
        this.findPlaylists(this.state.currentChannel);
      }
    };
    checkAPI();
  }

  setChannelResults = results => {
    this.setState({ channelResults: results });
  };

  processChannelResults = response => {
    this.setState({ prevChannelPage: response.result.prevPageToken });
    this.setState({ nextChannelPage: response.result.nextPageToken });
    return response.result.items.reduce((acc, el, index) => {
      acc[index] = {
        etag: el.etag,
        channelId: el.id.channelId,
        name: el.snippet.title,
        description: el.snippet.description,
        thumbnailURL: el.snippet.thumbnails.high.url,
        prevPage: el.prevPageToken,
        nextPage: el.nextPageToken
      };

      return acc;
    }, []);
  };

  findChannels(input) {
    if (input === "") {
      return Alert.error("Cannot leave search field blank", { timeout: 1500 });
    }

    this.setState({ currentSearch: input });
    new Promise((resolve, reject) => {
      if (this.state.apiLoaded) {
        resolve(
          window.gapi.client.youtube.search.list({
            q: `${input}`,
            part: "snippet",
            type: "channel",
            maxResults: 10,
            safeSearch: `${restrict}`,
            order: "relevance",
            fields:
              "items/etag, items/id/channelId, items/snippet/description, items/snippet/thumbnails/high/url, items/snippet/title, nextPageToken, prevPageToken"
          })
        );
      } else {
        reject(console.log("There was an error sending request"));
      }
    })
      .then(response => this.processChannelResults(response, input), function(
        reason
      ) {
        console.log("Error: " + reason);
      })
      .then(result => {
        this.setState({
          channelResults: result,
          searchOpen: true
        });
      });
  }

  closeSearch = () => {
    console.log("Closed search");
    this.setState({ searchOpen: false });
  };

  //Find channels based on pageToken to enable pagination. Had to break find channels into 2 functions. First, to retrieve the original set and set the search term.
  // Second, to navigate between the pages in the set.

  findChannelPages = (page, token) => {
    page === "next"
      ? (token = this.state.nextChannelPage)
      : (token = this.state.prevChannelPage);
    new Promise((resolve, reject) => {
      if (this.state.apiLoaded) {
        resolve(
          window.gapi.client.youtube.search.list({
            q: `${this.state.currentSearch}`,
            part: "snippet",
            type: "channel",
            maxResults: 10,
            safeSearch: `${restrict}`,
            order: "relevance",
            pageToken: `${token}`,
            fields:
              "items/etag, items/id/channelId, items/snippet/description, items/snippet/thumbnails/high/url, items/snippet/title, nextPageToken, prevPageToken"
          })
        );
      } else {
        reject(console.log("There was an error sending request"));
      }
    })
      .then(response => this.processChannelResults(response), function(reason) {
        console.log("Error: " + reason);
      })
      .then(result => {
        this.setState({
          channelResults: result
        });
      });
  };

  //Add/replace current channel to local storage and state.
  setCurrentChannel = clickedChannel => {
    if (
      Object.keys(localStorage)
        .filter(e => e.includes("currChannelId"))
        .join("") !== clickedChannel
    ) {
      localStorage.removeItem(
        Object.keys(localStorage)
          .filter(e => e.includes("currChannelId"))
          .join("")
      );
      localStorage.setItem(
        `currChannelId - ${clickedChannel}`,
        `${JSON.stringify(clickedChannel)}`
      );
    } else {
      console.log("Too many channels selected!");
    }

    this.state.currentChannel !== clickedChannel
      ? this.setState({ currentChannel: `${clickedChannel}` })
      : console.log("warning: channel already loaded");
  };

  findPlaylists = input => {
    new Promise((resolve, reject) => {
      if (this.state.apiLoaded) {
        resolve(
          window.gapi.client.youtube.playlists.list({
            channelId: `${input}`,
            part: "id, snippet, contentDetails",
            maxResults: 20,
            fields:
              "items/id, items/contentDetails/itemCount, items/snippet/title, items/snippet/thumbnails/medium/url, nextPageToken, prevPageToken"
          })
        );
      } else {
        reject(
          console.log("Loading Playlists: There was an error sending request")
        );
      }
    })
      .then(results => this.processPlaylistResults(results), function(reason) {
        console.log("Error: No playlists found" + reason);
      })
      .then(result => {
        this.setState({ currentPlaylists: result });
      });
  };

  processPlaylistResults = response => {
    return response.result.items.reduce((acc, el, index) => {
      acc[index] = {
        playlistId: el.id,
        playlistName: el.snippet.title,
        numOfVideos: el.contentDetails.itemCount,
        thumbnailURL: el.snippet.thumbnails.medium.url,
        prevPage: el.prevPageToken,
        nextPage: el.nextPageToken
      };
      return acc;
    }, []);
  };

  // Find playlists by clicking on channel. ComponendDidMount checkAPI function handles the loading of playlist from the current channel.
  findPlaylistsClick = input => {
    this.findPlaylists(input);
    this.setCurrentChannel(input);
  };

  findPlaylistVideos = input => {
    new Promise((resolve, reject) => {
      if (this.state.apiLoaded) {
        resolve(
          window.gapi.client.youtube.playlistItems.list({
            playlistId: `${input}`,
            part: "snippet, contentDetails",
            maxResults: 25
            // fields:
            //   "items/snippet/resourceId/videoId,  items/snippet/position, items/snippet/title, items/snippet/thumbnails/standard/url"
          })
        );
      } else {
        reject(console.log("There was an error sending request"));
      }
    })
      .then(
        function(response) {
          console.table(response);
          return response.result.items.reduce((acc, el, index) => {
            acc[index] = {
              videoId: el.snippet.resourceId.videoId,
              title: el.snippet.title,
              thumbnailURL: el.snippet.thumbnails.medium.url,
              positionInPlaylist: el.snippet.position
            };
            return acc;
          }, []);
        },
        function(reason) {
          console.log("Error: " + reason);
        }
      )
      .then(result => {
        console.table(result);
        this.setState({ currentVideos: result });
      });
  };

  setCurrentPlaylist = playlist => {
    this.setState({ currentPlaylist: "" });
    this.setState({ currentVideos: [] });
    this.setState({ playVideo: "" });
    //setTimeout is required to bypass React setting state asynchronously.
    window.setTimeout(() => {
      this.setState({ currentPlaylist: playlist });
      this.findPlaylistVideos(playlist);
    }, 100);
  };

  playSingleVideo = input => {
    this.setState({ currentPlaylist: "" });
    this.setState({ playVideo: "" });
    window.setTimeout(() => {
      this.setState({ playVideo: input });
    }, 100);
  };
  //Search button functionality
  searchChannels = input => {
    input.preventDefault();
    this.findChannels(input.target[0].value);
  };
  //Update state with saved channel IDs
  updateChannelList = input => {
    const currentKey =
      typeof input === "string" ? input : Object.keys(input).join("");
    let updatedChannels = [...this.state.savedChannels];
    const initialKeys = updatedChannels.map(e => Object.keys(e).join(""));
    if (initialKeys.includes(currentKey)) {
      updatedChannels.splice(initialKeys.indexOf(currentKey), 1);

      this.setState({ savedChannels: updatedChannels });
    } else {
      updatedChannels.push(input);
      this.setState({ savedChannels: updatedChannels });
      Alert.success("Channel Added");
    }
  };
  //Delete channel from Local Storage
  deleteChannel = input => {
    input.preventDefault();
    if (
      localStorage.getItem(`channelId - ${input.target.value}`) ||
      localStorage.getItem(`currChannelId - ${input.target.value}`)
    ) {
      localStorage.removeItem(`channelId - ${input.target.value}`);
      localStorage.removeItem(`currChannelId - ${input.target.value}`);
      this.updateChannelList(input.target.value);
      this.setState({ currentChannel: "" });
      Alert.warning("Channel Removed");
    } else {
      Alert.error("Something went wrong!", { timeout: 3000 });
      console.log("Delete error");
    }
  };

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Route
            path="/manage-channels"
            render={() => (
              <ManageChannels
                closeSearch={this.closeSearch}
                searching={this.state.searchOpen}
                searchResults={this.state.channelResults}
                savedChannels={this.state.savedChannels}
                updateList={this.updateChannelList}
                searchChannels={this.searchChannels}
                paginateChannels={this.findChannelPages}
                deleteChannel={this.deleteChannel}
                nextPageState={this.state.nextChannelPage}
                prevPageState={this.state.prevChannelPage}
              />
            )}
          />
          <Route
            path="/"
            exact
            render={() => (
              <Aux>
                <header>
                  <NavLink to="/" exact>
                    <img
                      id="logo"
                      src="assets/logo-beta.jpg"
                      alt="Kid Safe Videos Logo"
                    />
                  </NavLink>
                  <nav>
                    <NavLink to="/manage-channels">
                      {this.state.savedChannels.length === 0
                        ? `Load`
                        : `Change`}{" "}
                      Channels{" "}
                    </NavLink>
                  </nav>

                  <ListSavedChannels
                    apiLoaded={this.state.apiLoaded}
                    savedChannels={this.state.savedChannels}
                    findPlaylists={this.findPlaylistsClick}
                    currentChannel={this.state.currentChannel}
                  />
                </header>
                <main>
                  <ListPlaylists
                    currentPlaylists={this.state.currentPlaylists}
                    loadPlaylists={this.findPlaylistsLoad}
                    loadPlaylistVideos={this.findPlaylistVideos}
                    setCurrentPlaylist={this.setCurrentPlaylist}
                    currentChannel={this.state.currentChannel}
                    currentPlaylist={this.state.currentPlaylist}
                  />

                  <VideoPlayer
                    currentPlaylist={this.state.currentPlaylist}
                    currentVideo={this.state.playVideo}
                    savedChannels={this.state.savedChannels}
                    currentPlaylists={this.state.currentPlaylists}
                  />

                  <ListVideos
                    currentVideos={this.state.currentVideos}
                    playVideo={this.playSingleVideo}
                    currentPlaylist={this.state.currentPlaylist}
                  />
                </main>
              </Aux>
            )}
          />
          <Alert
            stack={{ limit: 3 }}
            timeout={2000}
            effect="scale"
            offset={50}
            position="top"
            beep={{
              error: "../assets/error.mp3"
            }}
          />
          {/* For Alert config see https://www.npmjs.com/package/react-s-alert */}
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
