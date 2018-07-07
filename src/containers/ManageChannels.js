import React, { Component } from "react";
import Search from "../components/SearchChannel";
import SearchResults from "../components/SearchResults";

class ManageChannels extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channelResults: []
    };
  }

  findChannels(input) {
    new Promise((resolve, reject) => {
      if (this.props.apiLoaded) {
        resolve(
          window.gapi.client.youtube.search.list({
            q: `${input}`,
            part: "id, snippet",
            type: "channel",
            maxResults: 10,
            safeSearch: "strict",
            order: "relevance",
            fields:
              "items/id/channelId, items/snippet/description, items/snippet/thumbnails/high/url, items/snippet/title"
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
        console.log(result);
        this.props.channelResults = result;

        // this.setState({
        //   channelResults: result
        // });
      })
      .then(console.log("Props", this.props.channelResults));
  }

  searchChannel = event => {
    event.preventDefault();
    this.findChannels(event.target[0].value);
  };

  render() {
    return (
      <div className="channel-search">
        <header className="App-header">
          <h1 className="App-title">Search for Channels</h1>
        </header>

        <Search click={this.searchChannel} searchValue={this.value} />
        <SearchResults
          searchResults={this.props.searchResults}
          //searchInfo={this.props.channelResults}
          savedChannels={this.props.savedChannels}
          updateList={this.props.updateList}
        />
      </div>
    );
  }
}

export default ManageChannels;
