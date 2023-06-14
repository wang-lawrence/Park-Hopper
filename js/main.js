const parks = [];

function getData() {
  const targetUrl = encodeURIComponent('https://developer.nps.gov/api/v1/parks?limit=150'); // API endpoint for parks
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://lfz-cors.herokuapp.com/?url=' + targetUrl); // use LFZ proxy to hit the API
  xhr.setRequestHeader('X-Api-Key', 'HEqLaQkujBH0fhLzsow81gtPfMLkLEOvPOGHxx2j'); // add API key to the request header
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    // console.log(xhr.status);
    // console.log(xhr.response);
    const $galleryContainer = document.querySelector('.gallery-container'); // query for the gallery container to add images to later
    for (let i = 0; i < xhr.response.data.length; i++) {
      if (xhr.response.data[i].designation === 'National Park') { // only want to keep National Parks, the API returns other things like historical sites
        parks.push(xhr.response.data[i]); // add all the National Park data objects to parks, may need to add this to a data object in the other file later
        for (let j = 0; j < xhr.response.data[i].images.length; j++) { // for each park data object we append all the images to the gallery and assign a data-name to be able to query the park details later
          const $img = document.createElement('img');
          $img.setAttribute('src', xhr.response.data[i].images[j].url);
          $img.setAttribute('data-park-name', xhr.response.data[i].name);
          $galleryContainer.appendChild($img);
        }
      }
    }
    const parksJSON = JSON.stringify(parks);
    localStorage.setItem('parks', parksJSON);
  });
  xhr.send();
}

getData();

// function getWeatherData() {
//   const xhr = new XMLHttpRequest();
//   xhr.open(
//     'GET',
//     'https://api.tomorrow.io/v4/timelines?location=40.758,-73.9855&fields=temperature,windSpeed,precipitationIntensity,weatherCode&timesteps=current,1d&units=imperial&timezone=America/Los_Angeles&apikey=bpvSnlVb8VniaV1uCGU8h3mC3R18i2eM'
//   );
//   xhr.responseType = 'json';
//   xhr.addEventListener('load', function () {
//     console.log(xhr.response);
//   });

//   xhr.send();
// }

// getWeatherData();
