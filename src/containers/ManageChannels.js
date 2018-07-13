import React, { Component } from "react";
import Search from "../components/SearchChannel";
import SearchResults from "../components/SearchResults";
import EditSavedChannels from "../components/editSavedChannels";

class ManageChannels extends Component {
  render() {
    return (
      <div className="channel-search">
        <header className="App-header">
          <h1 className="App-title">Search for Channels</h1>
        </header>
        <EditSavedChannels
          savedChannels={this.props.savedChannels}
          deleteChannel={this.props.deleteChannel}
        />
        <Search
          click={this.props.searchChannels}
          searchValue={this.props.value}
        />
        <SearchResults
          searchResults={this.props.searchResults}
          savedChannels={this.props.savedChannels}
          updateList={this.props.updateList}
        />
      </div>
    );
  }
}

export default ManageChannels;
