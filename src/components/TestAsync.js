import React from "react";
import Async from "react-promise";

let prom = new Promise(function(resolve, reject) {
  setTimeout(function() {
    resolve("a value");
  }, 1000);
});

const ExampleWithAsync = props => {
  let prom = new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve("a value");
    }, 1000);
  }).then(val => val);
  return <Async promise={prom} then={val => <div>{val}</div>} />;
};

export default ExampleWithAsync;
