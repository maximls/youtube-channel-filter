import React, { Component } from "react";
import "./App.css";
import ManageChannels from "./containers/ManageChannels";
import ListSavedChannels from "./components/ListSavedChannels";
import { key } from "./config";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiLoaded: false,
      savedChannelsIds: [],
      savedChannelsInfo: {},
      channelResults: []
    };
  }

  componentWillMount() {
    //Sync local storage with state on channel list updates
    const localStorageItems = [];

    for (let i = 0; i < localStorage.length; i++) {
      localStorageItems.push(localStorage.getItem(localStorage.key(i)));
    }

    this.setState({ savedChannelsIds: localStorageItems });

    //readyAPI() checks whether .youtube was loaded every .2 sec and once loaded, sets state.
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

  //Update state with channel IDs
  updateChannelList = e => {
    let updatedChannels = this.state.savedChannelsIds;

    if (updatedChannels.includes(e)) {
      updatedChannels.splice(updatedChannels.indexOf(e), 1);

      this.setState({ savedChannelsIds: updatedChannels });
    } else {
      updatedChannels.push(e);

      this.setState({ savedChannelsIds: updatedChannels });
    }
  };

  render() {
    let channels;

    if (this.state.apiLoaded) {
      channels = (
        <ListSavedChannels
          apiLoaded={this.state.apiLoaded}
          savedChannelsIds={this.state.savedChannelsIds}
          savecChannelInfo={this.state.savedChannelsInfo}
        />
      );
    }

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <ManageChannels
          searchResults={this.state.channelResults}
          apiLoaded={this.state.apiLoaded}
          savedChannels={this.state.savedChannelsIds}
          updateList={this.updateChannelList}
        />

        {channels}
      </div>
    );
  }
}

export default App;
