import React from "react";

const EditSavedChannels = ({ savedChannels, deleteChannel }) => {
  const savedList = savedChannels.map(e => {
    return (
      <li key={`${e[Object.keys(e).join("")].channelID}`}>
        <img
          src={e[Object.keys(e).join("")].thumbnailURL}
          alt={`Logo ${e[Object.keys(e).join("")].name}`}
        />
        <h1>{e[Object.keys(e).join("")].name}</h1>
        <button
          onClick={deleteChannel}
          value={`${e[Object.keys(e).join("")].channelID}`}
        >
          Delete
        </button>
      </li>
    );
  });

  return <ul className="edit-list saved-channels-list">{savedList}</ul>;
};

export default EditSavedChannels;
