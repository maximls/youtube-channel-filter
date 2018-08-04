import React from "react";

const search = props => {
  return (
    <form onSubmit={props.click}>
      <label className="search-label">Search for YouTube Channels</label>
      <input type="text" name="search" />
      <button type="submit">Search</button>
    </form>
  );
};

export default search;
