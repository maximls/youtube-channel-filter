import React, { Component } from 'react';
import './App.css';
import Search from './components/SearchChannel';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channelResults : {
         
          channelIid: 'channelId',
          name: 'channelName',
          description: 'channelDescription',
          thumbnailURL: 'thumbnailURL'
        },
      
      
      videoResults: {}
    
    
    
    }
  }


    //Google API Library Loader

      findChannels(input) {
                
      // Initializes the client with the API key and the YoutubeData API.
      
      const key = 'AIzaSyCQTQN5h2fNLc35XDssmGRQzIj-yOVaKcI';
      
      window.gapi.client.init({
        'apiKey': key,
        'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
      }).then(function() {
        // Executes an API request, and returns a Promise.
        return window.gapi.client.youtube.search.list({
          q: `${input}`,
          part: 'id, snippet',
          type: 'channel',
          maxResults: 10,
          safeSearch: 'strict',
          order: 'relevance',
          fields: 'items/id/channelId, items/snippet/description, items/snippet/thumbnails/high/url, items/snippet/title'
        });
      }).then(function(response) {     
        return response.result.items.reduce((acc, el, index) => {
          acc[index] = { channelId: el.id.channelId,
                          name: el.snippet.title,
                          description: el.snippet.description,
                          thumbnailURL: el.snippet.thumbnails.high.url }
          return acc;
        },{});
        }, function(reason) {
          console.log('Error: ' + reason.result.error.message);
        }).then( result => {
          console.log(result)
          this.setState({ channelResults :
            result
        })
        });
      }

      searchChannel = (event) => {
        event.preventDefault();
        console.log(event.target[0].value)
        this.findChannels(event.target[0].value);
        
      }
  render() {

    let searchEnabled = false;


    const enableSearch = () => searchEnabled = true;

    window.gapi.load('client', enableSearch);

  

    return (
      <div className="App">
        <header className="App-header">
    
          <h1 className="App-title">Welcome to React</h1>
        </header>
       
          <Search click = {this.searchChannel} searchValue = {this.value}/>
          To get started, edit <code>src/App.js</code> and save to reload.
        
      </div>
    );
  }
}

export default App;
