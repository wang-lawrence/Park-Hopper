const nationalParks = [];
const $galleryContainer = document.querySelector('.gallery-container'); // query for the gallery container to add images to later
const $stateDD = document.querySelector('#state');
const $activtyDD = document.querySelector('#activity');
let states = [];
let activities = [];

$stateDD.addEventListener('input', updateFilteredImg);
$activtyDD.addEventListener('input', updateFilteredImg);

getData();

function updateFilteredImg(event) {
  const selState = $stateDD.value;
  const selActivity = $activtyDD.value;
  while ($galleryContainer.firstChild) {
    $galleryContainer.removeChild($galleryContainer.firstChild);
  }
  const parksFilteredState = nationalParks.filter(parks => {
    if (selState === 'State') {
      return true;
    } else {
      return parks.states.includes(selState);
    }
  });

  const parksFilteredActivity = parksFilteredState.filter(parks => {
    if (selActivity === 'Activity') {
      return true;
    } else {
      for (let i = 0; i < parks.activities.length; i++) {
        if (parks.activities[i].name === selActivity) {
          return true;
        }
      }
      return false;
    }
  });

  for (let i = 0; i < parksFilteredActivity.length; i++) {
    renderImg(parksFilteredActivity[i]);
  }
}

function getData() {
  const targetUrl = encodeURIComponent('https://developer.nps.gov/api/v1/parks?limit=450'); // API endpoint for parks
  const xhr = new XMLHttpRequest();
  const uniqueStates = new Set();
  const uniqueActivities = new Set();
  xhr.open('GET', 'https://lfz-cors.herokuapp.com/?url=' + targetUrl); // use LFZ proxy to hit the API
  xhr.setRequestHeader('X-Api-Key', 'HEqLaQkujBH0fhLzsow81gtPfMLkLEOvPOGHxx2j'); // add API key to the request header
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    for (let i = 0; i < xhr.response.data.length; i++) {
      if (xhr.response.data[i].designation === 'National Park') { // only want to keep National Parks, the API returns other things like historical sites
        nationalParks.push(xhr.response.data[i]); // add all the National Park data objects to parks, may need to add this to a data object in the other file later
        uniqueStates.add(...xhr.response.data[i].states.split(',')); // add each state to the Set object, Set only holds unique item and duplicate items won't be added
        renderImg(xhr.response.data[i]);

        for (let k = 0; k < xhr.response.data[i].activities.length; k++) {
          uniqueActivities.add(xhr.response.data[i].activities[k].name); // add each state to the Set object, Set only holds unique item and duplicate items won't be added
        }
      }
    }
    states = [...uniqueStates].sort();
    activities = [...uniqueActivities].sort();

    for (let i = 0; i < states.length; i++) {
      const $option = document.createElement('option');
      $option.setAttribute('value', states[i]);
      $option.textContent = states[i];
      $stateDD.appendChild($option);
    }

    for (let i = 0; i < activities.length; i++) {
      const $option = document.createElement('option');
      $option.setAttribute('value', activities[i]);
      $option.textContent = activities[i];
      $activtyDD.appendChild($option);
    }

    const parksJSON = JSON.stringify(nationalParks);
    localStorage.setItem('parks', parksJSON);
  });
  xhr.send();
}

function renderImg(parkObj) {
  for (let j = 0; j < parkObj.images.length; j++) { // for each park data object we append all the images to the gallery and assign a data-name to be able to query the park details later
    const $img = document.createElement('img');
    $img.setAttribute('src', parkObj.images[j].url);
    $img.setAttribute('alt', `${parkObj.fullName} image`);
    $img.setAttribute('loading', 'lazy');
    $img.setAttribute('data-park-name', parkObj.name);
    $galleryContainer.appendChild($img);
  }
}
