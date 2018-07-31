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
            <img
              id="logo"
              src="assets/logo-beta.jpg"
              alt="Kid Safe Videos Logo"
            />
          </NavLink>
          <NavLink to="/about">About</NavLink>
          <div className="channel-search">
            <Search
              click={this.props.searchChannels}
              searchValue={this.props.value}
            />
            <NavLink to="/" exact>
              Back
            </NavLink>
          </div>
        </header>
        <h1>Saved Channels</h1>
        <EditSavedChannels
          savedChannels={this.props.savedChannels}
          deleteChannel={this.props.deleteChannel}
        />

        <SearchResults
          closeSearch={this.props.closeSearch}
          searchResults={this.props.searchResults}
          searching={this.props.searching}
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
