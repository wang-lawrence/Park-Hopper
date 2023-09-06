/* global carousel */

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
const $noMatch = document.querySelector('.no-match');
const $connectionError = document.querySelector('.connection-error');
const $homeView = document.querySelector('[data-view="home"]');
const $parkHopperLogo = document.querySelector('.navbar-brand');
const $exploreButton = document.querySelector('.explore-button');
const $heroImageWrapper = document.querySelector('.hero-image-wrapper');
const $quoteContainer = document.querySelector('.quote-container');
const $homeParkName = document.querySelector('.park em');
const $progressDotsContainer = document.querySelector('.progress-dots-container');
makeProgressDots();
const $progressDot = document.querySelectorAll('.fa-circle');

$stateDD.addEventListener('input', updateFilteredImg);
$activtyDD.addEventListener('input', updateFilteredImg);
$galleryContainer.addEventListener('click', showParkDetail);
$goBack.addEventListener('click', goBack);
$goBackSavedParks.addEventListener('click', goBackSavedParks);
$saveListIcon.addEventListener('click', showSavedParks);
$desktopHeart.addEventListener('click', updateFavoriteList);
$mobileHeart.addEventListener('click', updateFavoriteList);
$savedParksImgContainer.addEventListener('click', showParkDetail);
$parkHopperLogo.addEventListener('click', showHomePage);
$exploreButton.addEventListener('click', showGallery);
$progressDotsContainer.addEventListener('click', goToSlide);

renderAllScreens();
getData();

function removeSavedPark(event) {
  event.stopPropagation();
  const $card = event.target.closest('.saved-card');
  const parkName = $card.getAttribute('data-park-name');
  $card.closest('.card-col').remove();
  data.savedParks.splice(data.savedParks.indexOf(parkName), 1);
  data.savedParksImg.splice(data.savedParks.indexOf(parkName), 1);
  toggleNoSavedParksMessage();
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
  toggleNoSavedParksMessage();
}

function goBack(event) {
  $homeView.classList.add('hidden');
  $galleryView.classList.remove('hidden');
  $parkDetailsView.classList.add('hidden');
  $savedParksView.classList.add('hidden');
  data.currentPark = null;
}

function goBackSavedParks(event) {
  $homeView.classList.add('hidden');
  $galleryView.classList.remove('hidden');
  $parkDetailsView.classList.add('hidden');
  $savedParksView.classList.add('hidden');
}

function showSavedParks(event) {
  $homeView.classList.add('hidden');
  $galleryView.classList.add('hidden');
  $parkDetailsView.classList.add('hidden');
  $savedParksView.classList.remove('hidden');
}

function showHomePage() {
  $homeView.classList.remove('hidden');
  $galleryView.classList.add('hidden');
  $parkDetailsView.classList.add('hidden');
  $savedParksView.classList.add('hidden');
}

function showGallery() {
  $homeView.classList.add('hidden');
  $galleryView.classList.remove('hidden');
  $parkDetailsView.classList.add('hidden');
  $savedParksView.classList.add('hidden');
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
  renderAllImg(selParkObj, $parkImgContainer);
  $homeView.classList.add('hidden');
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
    renderFirstImg(parksFilteredActivity[i], $galleryContainer);
  }

  toggleNoMatchMessage(parksFilteredActivity);
}

function getData() {
  showSpinner();
  // only want to keep National Parks, provide filter in the endpoint to only return specified parks. If we remove the filter we could get other things like historic sites or monuments
  const targetUrl = encodeURIComponent('https://developer.nps.gov/api/v1/parks?limit=469&parkCode=acad,arch,badl,bibe,bisc,blca,brca,cany,care,cave,chis,cong,crla,cuva,deva,dena,drto,ever,gaar,jeff,glba,glac,grca,grte,grba,grsa,grsm,gumo,hale,havo,hosp,indu,isro,jotr,katm,kefj,kova,lacl,lavo,maca,meve,mora,neri,noca,npsa,olym,pefo,pinn,redw,romo,sagu,seki,shen,thro,viis,voya,whsa,wica,wrst,yell,yose,zion'); // API endpoint for parks
  const xhr = new XMLHttpRequest();
  const uniqueStates = new Set();
  const uniqueActivities = new Set();
  xhr.open('GET', 'https://lfz-cors.herokuapp.com/?url=' + targetUrl); // use LFZ proxy to hit the API
  xhr.setRequestHeader('X-Api-Key', 'HEqLaQkujBH0fhLzsow81gtPfMLkLEOvPOGHxx2j'); // add API key to the request header
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    for (let i = 0; i < xhr.response.data.length; i++) {
      const trimmedParkName = xhr.response.data[i].name.replaceAll(' ', ''); // need to remove spaces in order to query DOM elements using data-park-name attributes
      const nationalPark = { ...xhr.response.data[i], name: trimmedParkName };
      nationalParks.push(nationalPark); // add all the National Park data objects to parks, may need to add this to a data object in the other file later
      uniqueStates.add(...xhr.response.data[i].states.split(',')); // add each state to the Set object, Set only holds unique item and duplicate items won't be added
      renderFirstImg(nationalPark, $galleryContainer);
      for (let k = 0; k < xhr.response.data[i].activities.length; k++) {
        uniqueActivities.add(xhr.response.data[i].activities[k].name); // add each state to the Set object, Set only holds unique item and duplicate items won't be added
      }
    }

    const states = [...uniqueStates].sort();
    const activities = [...uniqueActivities].sort();

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

    setTimeout(hideSpinner, 5000);
    toggleErrorMessage(xhr.response.data);
  });
  xhr.send();
}

function renderAllImg(parkObj, parent) {
  for (let j = 0; j < parkObj.images.length; j++) { // for each park data object we append all the images to the gallery and assign a data-name to be able to query the park details later
    const $img = document.createElement('img');
    $img.setAttribute('src', parkObj.images[j].url);
    $img.setAttribute('alt', `${parkObj.fullName} image`);
    $img.setAttribute('data-park-name', parkObj.name);
    parent.appendChild($img);
  }
}

function renderFirstImg(parkObj, parent) {
  const $img = document.createElement('img');
  $img.setAttribute('src', parkObj.images[0].url);
  $img.setAttribute('alt', `${parkObj.fullName} image`);
  $img.setAttribute('data-park-name', parkObj.name);
  parent.appendChild($img);
}

function toggleNoSavedParksMessage() {
  if (data.savedParks.length === 0) {
    $noParkMsg.classList.remove('hidden');
  } else {
    $noParkMsg.classList.add('hidden');
  }
}

function toggleNoMatchMessage(selectedParks) {
  if (selectedParks.length === 0) {
    $noMatch.classList.remove('hidden');
  } else {
    $noMatch.classList.add('hidden');
  }
}

function toggleErrorMessage(parkResponse) {
  if (!parkResponse || parkResponse.length === 0) {
    $connectionError.classList.remove('hidden');
  } else {
    $connectionError.classList.add('hidden');
  }
}

// carousel related functions

let imageView = 0;
const intervalTimer = 8000;

// make the progress dots dynamic depending on number of images
function makeProgressDots() {
  for (let i = 0; i < carousel.length; i++) {
    const $i = document.createElement('i');

    if (i === 0) {
      $i.className = 'fa-solid fa-circle';
    } else {
      $i.className = 'fa-regular fa-circle';
    }

    $i.setAttribute('data-view', `${i}`);
    $progressDotsContainer.appendChild($i);
  }
}

function renderAllScreens() {
  for (let i = 0; i < carousel.length; i++) {
    const $heroImg = document.createElement('img');
    const $homeQuote = document.createElement('h4');
    if (i === 0) {
      $heroImg.className = 'item active';
      $homeQuote.className = 'quote active';
    } else {
      $heroImg.className = 'item';
      $homeQuote.className = 'quote';
    }
    const { quote, url } = carousel[i];
    $heroImg.setAttribute('data-slider-item', `${i}`);
    $heroImg.src = url;
    $heroImageWrapper.appendChild($heroImg);
    $homeQuote.setAttribute('data-slider-quote', `${i}`);
    $homeQuote.textContent = quote;
    $quoteContainer.appendChild($homeQuote);
  }
}

function renderScreen(i) {
  const $currentImg = document.querySelector('.active.item');
  $currentImg.classList.remove('active');
  const $nextImg = document.querySelector(`[data-slider-item = "${i}"]`);
  $nextImg.classList.add('active');

  const $currentQuote = document.querySelector('.quote.active');
  $currentQuote.classList.remove('active');
  const $nextQuote = document.querySelector(`[data-slider-quote = "${i}"]`);
  $nextQuote.classList.add('active');
  $homeParkName.textContent = carousel[i].park;
}

function showNextHomeScreen() {
  $progressDot[imageView].classList.replace('fa-solid', 'fa-regular');
  imageView++;
  if (imageView >= carousel.length) {
    imageView = 0;
  }
  renderScreen(imageView);
  $progressDot[imageView].classList.replace('fa-regular', 'fa-solid');
}

let intervalId = setInterval(showNextHomeScreen, intervalTimer);

function goToSlide(event) {
  $progressDot[imageView].classList.replace('fa-solid', 'fa-regular');
  imageView = +event.target.getAttribute('data-view');
  renderScreen(imageView);
  $progressDot[imageView].classList.replace('fa-regular', 'fa-solid');
  clearInterval(intervalId);
  intervalId = setInterval(showNextHomeScreen, intervalTimer);
}
