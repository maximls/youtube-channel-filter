import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import Search from "../components/SearchChannel";
import SearchResults from "../components/SearchResults";
import EditSavedChannels from "../components/editSavedChannels";

class ManageChannels extends Component {
  render() {
    return (
      <div className="manage-channels">
        <header>
          <NavLink to="/" exact>
            Home
          </NavLink>
          <h1 className="App-title">Search for Channels</h1>
        </header>
        <div className="channel-search">
          <Search
            click={this.props.searchChannels}
            searchValue={this.props.value}
          />
        </div>

        <EditSavedChannels
          savedChannels={this.props.savedChannels}
          deleteChannel={this.props.deleteChannel}
        />

        <SearchResults
          searchResults={this.props.searchResults}
          savedChannels={this.props.savedChannels}
          updateList={this.props.updateList}
          paginate={this.props.paginateChannels}
          prevPageState={this.props.prevPageState}
          nextPageState={this.props.nextPageState}
        />
      </div>
    );
  }
}

export default ManageChannels;
