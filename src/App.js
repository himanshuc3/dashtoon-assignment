import logo from './logo.svg';
import './App.css';

import {useState} from 'react';

let urlCreator = window.URL || window.webkitURL


const STATUS = {
  IDLE: 0,
  FETCHING: 1,
  SUCCESS: 2
}

function App() {

  const [search, onChangeSearch] = useState("");
  const [imageURLs, changeImageURLs] = useState([]);
  const [status, changeStatus] = useState(STATUS.IDLE);



  function handleChange(e){
    onChangeSearch(e.target.value)
  }

  async function query(data) {
    return fetch(
      "https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud",
      {
        headers: { 
          "Accept": "image/png",
          "Authorization": "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM", 
          "Content-Type": "application/json" 
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    ).then(response => response.blob());
}

  async function getComicStrip(){


    try{
let searchFrames = search.split(',');

    changeStatus(STATUS.FETCHING);

    searchFrames = searchFrames.slice(0,Math.min(10,searchFrames.length));

    const promises = searchFrames.map((text) => query({"inputs": `${text}`}));

    const data = await Promise.all(promises);

    const imageUrls = data.map((blob) => urlCreator.createObjectURL(blob));
    changeStatus(STATUS.SUCCESS);


    changeImageURLs(imageUrls);
    }catch(err){
      // should ideally be ERROR status, but due to time constraints 
      // keeping it as IDLE
      changeStatus(STATUS.IDLE)
    }
    
  }

  return (
    <div className="homepage">
      <div className="column">
        <h1 className="poster">Comic Creator</h1>
        <p className="subtext-poster">Dashtoon assignment (IITG) <br/>By Himanshu Chhabra (224101023)</p> 
        <p className="help">Notice: Separate text by comma to generate multiple panels and we take the first 10 panels into <br/> consideration. There are some problems with 
        the below approach like fetching all<br/>  images even if one input changes, comma cannot be part of the search input etc.</p> 

        <div className="user-input">
          <input type="text" value={search} onChange={handleChange}/>
          <button onClick={getComicStrip}>Generate comic</button>
        </div>

        <div className={`comic-strip ${status == STATUS.IDLE && 'empty'}`}>
          {status == STATUS.SUCCESS && 
           imageURLs.map((url,i) => (
            <img className="comic-panel" src={url} key={i} />
            ))
          
          }



          {status == STATUS.FETCHING &&
            <p>Loading</p>
          }

        </div>

      </div>
        
    </div>
  );
}

export default App;
