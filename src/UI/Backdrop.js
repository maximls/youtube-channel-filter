import React from "react";

const Backdrop = props => {
  return props.show ? (
    <div className="backdrop" onClick={props.closeSearch} />
  ) : null;
};

export default Backdrop;
