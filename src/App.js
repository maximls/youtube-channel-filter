import React, { Component } from "react";
import { BrowserRouter } from "react-router-dom";
import { Route, NavLink } from "react-router-dom";
import "./App.css";
import ManageChannels from "./containers/ManageChannels";
import ListSavedChannels from "./components/ListSavedChannels";
import ListPlaylists from "./components/ListPlaylists";
import { key, restrict } from "./config";
import VideoPlayer from "./containers/VideoPlayer";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiLoaded: false,
      savedChannels: {},
      currentChannel: ``,
      currentPlaylists: [],
      currentPlaylist: ``,
      channelResults: []
    };
  }

  componentWillMount() {
    //Sync local storage with state on channel list updates
    const localStorageChannels = [];

    Object.keys(localStorage)
      .filter(e => e.includes("channelId"))
      .forEach(e => {
        localStorageChannels.push(JSON.parse(localStorage.getItem(e)));
      });

    this.setState({ savedChannels: localStorageChannels });

    const localStorageCurrChannel = [];

    Object.keys(localStorage)
      .filter(e => e.includes("currChannelId"))
      .forEach(e => {
        localStorageCurrChannel.push(JSON.parse(localStorage.getItem(e)));
      });

    this.setState({ currentChannel: localStorageCurrChannel });

    //readyAPI() checks whether .youtube was loaded every 0.2 sec and once loaded, sets state.
    const readyApi = () => {
      if (window.gapi.client.youtube === undefined) {
        window.setTimeout(function() {
          readyApi();
        }, 200);
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
  }

  setChannelResults = results => {
    this.setState({ channelResults: results });
  };

  findChannels(input) {
    new Promise((resolve, reject) => {
      if (this.state.apiLoaded) {
        resolve(
          window.gapi.client.youtube.search.list({
            q: `${input}`,
            part: "id, snippet",
            type: "channel",
            maxResults: 10,
            safeSearch: `${restrict}`,
            order: "relevance",
            fields:
              "items/etag, items/id/channelId, items/snippet/description, items/snippet/thumbnails/high/url, items/snippet/title"
          })
        );
      } else {
        reject(console.log("There was an error sending request"));
      }
    })
      .then(
        function(response) {
          return response.result.items.reduce((acc, el, index) => {
            acc[index] = {
              etag: el.etag,
              channelId: el.id.channelId,
              name: el.snippet.title,
              description: el.snippet.description,
              thumbnailURL: el.snippet.thumbnails.high.url
            };
            return acc;
          }, []);
        },
        function(reason) {
          console.log("Error: " + reason);
        }
      )
      .then(result => {
        this.setState({
          channelResults: result
        });
      });
  }

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
            maxResults: 10,
            fields:
              "items/id, items/contentDetails/itemCount, items/snippet/title, items/snippet/thumbnails/medium/url"
          })
        );
      } else {
        reject(console.log("There was an error sending request"));
      }
    })
      .then(
        function(response) {
          return response.result.items.reduce((acc, el, index) => {
            acc[index] = {
              playlistId: el.id,
              playlistName: el.snippet.title,
              numOfVideos: el.contentDetails.itemCount,
              thumbnailURL: el.snippet.thumbnails.medium.url
            };
            return acc;
          }, []);
        },
        function(reason) {
          console.log("Error: " + reason);
        }
      )
      .then(result => {
        this.setState({ currentPlaylists: result });
      });
  };

  findPlaylistsClick = click => {
    this.findPlaylists(click);
    this.setCurrentChannel(click);
  };

  findPlaylistsLoad = currentChannel => {
    this.findPlaylists(currentChannel);
  };

  setCurrentPlaylist = playlist => {
    this.setState({ currentPlaylist: "" });
    window.setTimeout(() => {
      this.setState({ currentPlaylist: playlist });
    }, 100);
  };

  findPlaylistVideos = input => {
    new Promise((resolve, reject) => {
      if (this.state.apiLoaded) {
        resolve(
          window.gapi.client.youtube.playlistItems.list({
            playlistId: `${input}`,
            part: "id, snippet, contentDetails",
            maxResults: 25
            // fields:
            //   "items/id, items/contentDetails/itemCount, items/snippet/title, items/snippet/thumbnails/standard/url"
          })
        );
      } else {
        reject(console.log("There was an error sending request"));
      }
    }).then(result => console.table(result));

    // .then(
    //   function(response) {
    //     return response.result.items.reduce((acc, el, index) => {
    //       acc[index] = {
    //         playlistId: el.id,
    //         playlistName: el.snippet.title,
    //         numOfVideos: el.contentDetails.itemCount,
    //         thumbnailURL: el.snippet.thumbnails.medium.url
    //       };
    //       return acc;
    //     }, []);
    //   },
    //   function(reason) {
    //     console.log("Error: " + reason);
    //   }
    // )
    // .then(result => {
    //   console.log(result);
    //   //this.setState({ currentPlaylists: result });
    // });
  };

  //Search button functionality
  searchChannels = event => {
    event.preventDefault();
    this.findChannels(event.target[0].value);
  };
  //Update state with saved channel IDs
  updateChannelList = input => {
    let updatedChannels = [...this.state.savedChannels];
    //create arrays from objects keys
    const initialKeys = updatedChannels.map(e => Object.keys(e).join(""));
    const currentKey =
      typeof input === "string" ? input : Object.keys(input).join("");

    if (initialKeys.includes(currentKey)) {
      updatedChannels.splice(initialKeys.indexOf(currentKey), 1);

      this.setState({ savedChannels: updatedChannels });
    } else {
      updatedChannels.push(input);

      this.setState({ savedChannels: updatedChannels });
    }
  };

  deleteChannel = event => {
    event.preventDefault();
    if (localStorage.getItem(`channelId - ${event.target.value}`)) {
      localStorage.removeItem(`channelId - ${event.target.value}`);
      this.updateChannelList(event.target.value);
    } else {
      console.log("Delete error");
    }
  };

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <nav>
            <NavLink to="/" exact>
              Home{" "}
            </NavLink>
            <NavLink to="/manage-channels">Manage Channels </NavLink>
          </nav>

          <Route
            path="/manage-channels"
            render={() => (
              <ManageChannels
                searchResults={this.state.channelResults}
                savedChannels={this.state.savedChannels}
                updateList={this.updateChannelList}
                searchChannels={this.searchChannels}
                deleteChannel={this.deleteChannel}
              />
            )}
          />
          <Route
            path="/"
            exact
            render={() => (
              <div>
                <h1>Channels</h1>
                <ListSavedChannels
                  apiLoaded={this.state.apiLoaded}
                  savedChannels={this.state.savedChannels}
                  findPlaylists={this.findPlaylistsClick}
                  currentChannel={this.state.currentChannel}
                />
                <h1>Playlists</h1>
                <ListPlaylists
                  currentPlaylists={this.state.currentPlaylists}
                  loadPlaylists={this.findPlaylistsLoad}
                  loadPlaylistVideos={this.findPlaylistVideos}
                  setCurrentPlaylist={this.setCurrentPlaylist}
                />

                <VideoPlayer currentPlaylist={this.state.currentPlaylist} />
              </div>
            )}
          />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
