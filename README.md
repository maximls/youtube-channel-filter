#Source code for safekidsvideos.com

Create config.js in ./src directory. Replace with your own API keys;

<pre><code>
export let key = "";

window.location === "https://kidsafevideos.com"
  ? (key = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
  : (key = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");

export const restrict = "strict"; // other options: "none", "moderate" More info: https://developers.google.com/youtube/v3/docs/search/list (safeSearch)
export const numOfChannels = 3; // number of channels allowed
</pre></code>
