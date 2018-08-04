export let key = "";

window.location === "https://kidsafevideos.com"
  ? (key = "AIzaSyCQTQN5h2fNLc35XDssmGRQzIj-yOVaKcI")
  : (key = "AIzaSyDjvtxj1IXXksz8mFZpN91ISB6ogYmE4vc");

export const restrict = "strict"; // other options: "none", "moderate" More info: https://developers.google.com/youtube/v3/docs/search/list (safeSearch)
export const numOfChannels = 3; // number of channels allowed
