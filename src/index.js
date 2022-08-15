import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries.js';
import countryList from './handlebars_files/country_list.hbs';
import countryInfo from './handlebars_files/country_info.hbs';

const DEBOUNCE_DELAY = 300;

const refs = {
    input: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(evt) {
    const country = evt.target.value.trim();
    if (country.length <= 0) {
        refs.countryList.innerHTML = '';
        refs.countryInfo.innerHTML = '';
        return;
    }
    fetchCountries(country)
        .then(data => {
            if (data.length > 10) {
                Notiflix.Notify.info(
                    'Too many matches found. Please enter a more specific name.',
                );
            } else if (data.length >= 2 && data.length <= 10) {
                createListCard(data);
            } else {
                createInfoCard({
                    ...data[0],
                    languages: Object.values(data[0].languages).join(', '),
                });
            }
        })
        .catch(error => {
            refs.countryList.innerHTML = '';
            refs.countryInfo.innerHTML = '';
            Notiflix.Notify.failure('Oops, there is no country with that name');
        });
}

function createListCard(countries) {
    refs.countryInfo.innerHTML = '';
    refs.countryList.insertAdjacentHTML('afterbegin', countryList(countries));
}

function createInfoCard(country) {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = countryInfo(country);
}
