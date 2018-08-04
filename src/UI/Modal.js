import React from "react";
import Aux from "../hoc/Wrap";
import Backdrop from "./Backdrop";

const Modal = props => {
  let modalClass = "";
  props.show ? (modalClass = "modal") : (modalClass = "hide-modal");

  return (
    <Aux>
      <Backdrop closeSearch={props.closeSearch} show={props.show} />
      <div className={modalClass}>
        <span className="close-search" onClick={props.closeSearch}>
          Close
        </span>
        {props.children}
      </div>
    </Aux>
  );
};

export default Modal;
