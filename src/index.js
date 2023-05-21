import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const refs = {
inputContainer: document.querySelector('#search-box'),
listContainer: document.querySelector('.country-list'),
infoContainer: document.querySelector('.country-info'),
};


refs.inputContainer.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));



function onInputSearch(evt) {
   clearPage();

   const inputValue = evt.target.value.trim();
   if (!inputValue){
      return;
   }
  
   fetchCountries(inputValue)
   .then(data => {
      if(data.length === 1){
         showOneCountry(data[0])
      } else if (data.length > 1 && data.length <= 10){
         showListCountries(data)
      } else {
         showNotification()
      }
   })
   .catch((err) => handleError(err))
}

function showOneCountry(country){
   refs.infoContainer.innerHTML = createMarkupOneCountry(country);
   
}

function showListCountries(countries) {
   refs.listContainer.innerHTML = createMarkupListCountries(countries)
}

function showNotification(){
   Notify.info("Too many matches found. Please enter a more specific name.");
}

function handleError(err){
   if(err.message === '404'){
      Notify.failure("Oops, there is no country with that name");
   } 
   console.log(err);
}

function createMarkupOneCountry({ flags, name, capital, population, languages }){
   return `
   <div class="countries-list">
        <img src="${flags.svg}" alt="${name.official}" class="flag-pic">
        <h2 class="country-title">${name.official}</h2>
      </div>
      <div class="info-container">
        <p class="country-info"><span class="title-info">Capital:  </span>${capital}</p>
        <p class="country-info"><span class="title-info">Population:  </span>${population}</p>
        <p class="country-info"><span class="title-info">Languages:  </span>${Object.values(languages).join(', ')}
        </p>
      </div>
   `
}

function createMarkupListCountries(countries){
   return countries.map(({ name, flags }) => 
      `
      <li class="countries-list">
         <img src="${flags.svg}" alt="${name.official}" class="flag-pic">
         <h2 class="countrty-name">${name.official}</h2>
      </li>
      `  
   ).join('');
}

function clearPage(){
   refs.infoContainer.innerHTML = '';
   refs.listContainer.innerHTML = '';
}

   
