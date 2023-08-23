const nationalParks = [];
const $galleryContainer = document.querySelector('.gallery-container'); // query for the gallery container to add images to later
const $stateDD = document.querySelector('#state');
const $activtyDD = document.querySelector('#activity');
const $spinnerContainer = document.querySelector('.spinner-container');
const $galleryView = document.querySelector('[data-view="gallery"]');
const $parkDetailsView = document.querySelector('[data-view="park-details"]');
const $parkHeader = document.querySelector('.park-header');
const $parkDesc = document.querySelector('.park-desc');
const $parkActivities = document.querySelector('.park-activities');
const $parkImgContainer = document.querySelector('.park-detail-img-container');
const $goBack = document.querySelector('.go-back');
const $savedParksView = document.querySelector('[data-view="saved-parks"]');
const $goBackSavedParks = document.querySelector('.go-back-saved-parks');
const $saveListIcon = document.querySelector('.fa-rectangle-list');
const $desktopHeart = document.querySelector('.desktop-heart > i');
const $mobileHeart = document.querySelector('.mobile-heart > i');
const $savedParksImgContainer = document.querySelector('.saved-parks-img-container');
const $noParkMsg = document.querySelector('.no-park-msg');

let states = [];
let activities = [];

$stateDD.addEventListener('input', updateFilteredImg);
$activtyDD.addEventListener('input', updateFilteredImg);
$galleryContainer.addEventListener('click', showParkDetail);
$goBack.addEventListener('click', goBack);
$goBackSavedParks.addEventListener('click', goBackSavedParks);
$saveListIcon.addEventListener('click', showSavedParks);
$desktopHeart.addEventListener('click', updateFavoriteList);
$mobileHeart.addEventListener('click', updateFavoriteList);
$savedParksImgContainer.addEventListener('click', showParkDetail);

getData();

function removeSavedPark(event) {
  event.stopPropagation();
  const $card = event.target.closest('.saved-card');
  const parkName = $card.getAttribute('data-park-name');
  $card.closest('.card-col').remove();
  data.savedParks.splice(data.savedParks.indexOf(parkName), 1);
  data.savedParksImg.splice(data.savedParks.indexOf(parkName), 1);
  toggleNoParksMessage();
}

function updateFavoriteList(event) {

  $desktopHeart.classList.toggle('font-bold');
  $mobileHeart.classList.toggle('font-bold');
  if (data.savedParks.indexOf(data.currentPark.name) === -1) {
    data.savedParks.push(data.currentPark.name);
    data.savedParksImg.push(data.currentPark.images[0].url);
    const $col = document.createElement('div');
    const $heart = document.createElement('i');
    const $card = document.createElement('div');
    const $img = document.createElement('img');
    const $p = document.createElement('p');

    $col.className = 'col-sm-6 col-lg-4 col-xl-3 card-col';
    $card.className = 'saved-card';
    $card.setAttribute('data-park-name', data.currentPark.name);
    $heart.className = 'fa-solid fa-heart fa-2xl line-height saved-heart';
    $heart.addEventListener('click', removeSavedPark);
    $img.setAttribute('src', data.currentPark.images[0].url);
    $img.setAttribute('alt', `${data.currentPark.fullName} image`);
    $p.className = 'text-center mt-2 mb-2 proza-normal';
    $p.textContent = data.currentPark.fullName;

    $card.append($heart, $img, $p);
    $col.append($card);
    $savedParksImgContainer.append($col);

  } else {
    data.savedParks.splice(data.savedParks.indexOf(data.currentPark.name), 1);
    data.savedParksImg.splice(data.savedParks.indexOf(data.currentPark.name), 1);
    const $card = document.querySelector(`.card-col [data-park-name=${data.currentPark.name}]`);
    $card.closest('.card-col').remove();
  }
  toggleNoParksMessage();
}

function goBack(event) {
  $galleryView.classList.remove('hidden');
  $parkDetailsView.classList.add('hidden');
  $savedParksView.classList.add('hidden');
  data.currentPark = null;
}

function goBackSavedParks(event) {
  $galleryView.classList.remove('hidden');
  $parkDetailsView.classList.add('hidden');
  $savedParksView.classList.add('hidden');
}

function showSavedParks(event) {
  $galleryView.classList.add('hidden');
  $parkDetailsView.classList.add('hidden');
  $savedParksView.classList.remove('hidden');
}

function showParkDetail(event) {
  const selParkName = event.target.closest('[data-park-name]').getAttribute('data-park-name');
  const selParkObj = nationalParks.filter(obj => obj.name === selParkName)[0];
  data.currentPark = selParkObj;
  if (data.savedParks.indexOf(data.currentPark.name) === -1) {
    $desktopHeart.classList.remove('font-bold');
    $mobileHeart.classList.remove('font-bold');
  } else {
    $desktopHeart.classList.add('font-bold');
    $mobileHeart.classList.add('font-bold');
  }
  window.scrollTo(0, 0);
  $parkHeader.setAttribute('href', selParkObj.url);
  $parkHeader.textContent = `${selParkObj.fullName}, ${selParkObj.states.replaceAll(',', '/')}`;
  $parkDesc.textContent = selParkObj.description;
  $parkActivities.textContent = `Things to do: ${selParkObj.activities.map(act => act.name).join(', ')}`;
  while ($parkImgContainer.firstChild) {
    $parkImgContainer.removeChild($parkImgContainer.firstChild);
  }
  renderImg(selParkObj, $parkImgContainer);
  $galleryView.classList.add('hidden');
  $savedParksView.classList.add('hidden');
  $parkDetailsView.classList.remove('hidden');
}

function showSpinner() {
  $spinnerContainer.classList.remove('hidden');
  $galleryContainer.classList.add('hidden');
}
function hideSpinner() {
  $spinnerContainer.classList.add('hidden');
  $galleryContainer.classList.remove('hidden');
}

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
    renderImg(parksFilteredActivity[i], $galleryContainer);
  }
}

function getData() {
  showSpinner();
  // only want to keep National Parks, provide filter in the endpoint to only return specified parks. If we remove the filter we could get other things like historic sites or monuments
  const targetUrl = encodeURIComponent('https://developer.nps.gov/api/v1/parks?limit=469&parkCode=acad,arch,badl,bibe,bisc,blca,brca,cany,care,cave,chis,cong,crla,cuva,deva,drto,ever,jeff,glac,grca,grte,grba,grsm,gumo,hale,havo,hosp,indu,isro,jotr,kefj,kova,lavo,maca,meve,mora,noca,olym,pefo,pinn,romo,sagu,shen,thro,viis,voya,whsa,wica,yell,yose'); // API endpoint for parks
  const xhr = new XMLHttpRequest();
  const uniqueStates = new Set();
  const uniqueActivities = new Set();
  xhr.open('GET', 'https://lfz-cors.herokuapp.com/?url=' + targetUrl); // use LFZ proxy to hit the API
  xhr.setRequestHeader('X-Api-Key', 'HEqLaQkujBH0fhLzsow81gtPfMLkLEOvPOGHxx2j'); // add API key to the request header
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    for (let i = 0; i < xhr.response.data.length; i++) {
      // if (xhr.response.data[i].designation === 'National Park') {
      const trimmedParkName = xhr.response.data[i].name.replaceAll(' ', '');
      const nationalPark = { ...xhr.response.data[i], name: trimmedParkName };
      nationalParks.push(nationalPark); // add all the National Park data objects to parks, may need to add this to a data object in the other file later
      uniqueStates.add(...xhr.response.data[i].states.split(',')); // add each state to the Set object, Set only holds unique item and duplicate items won't be added
      renderImg(nationalPark, $galleryContainer);

      for (let k = 0; k < xhr.response.data[i].activities.length; k++) {
        uniqueActivities.add(xhr.response.data[i].activities[k].name); // add each state to the Set object, Set only holds unique item and duplicate items won't be added
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

    hideSpinner();
  });
  xhr.send();
}

function renderImg(parkObj, parent) {
  for (let j = 0; j < parkObj.images.length; j++) { // for each park data object we append all the images to the gallery and assign a data-name to be able to query the park details later
    const $img = document.createElement('img');
    $img.setAttribute('src', parkObj.images[j].url);
    $img.setAttribute('alt', `${parkObj.fullName} image`);
    $img.setAttribute('data-park-name', parkObj.name);
    parent.appendChild($img);
  }
}

function toggleNoParksMessage() {
  if (data.savedParks.length === 0) {
    $noParkMsg.classList.remove('hidden');
  } else {
    $noParkMsg.classList.add('hidden');
  }
}
