
function loadDailyQuote() {

    const today =
        Math.floor(Date.now() / 86400000);

    const country =
        countries[today % countries.length];

    document.getElementById("dailyCountry")
        .textContent = country.flag + " " + country.name;

    document.getElementById("dailyQuote")
        .textContent =
        `"${country.quote}" — ${country.author}`;
}
const container =
document.getElementById("countriesContainer");

function renderCountries(list) {

container.innerHTML = "";

list.forEach(country => {

const card =
document.createElement("button");

card.className = "country-card";

card.textContent =
`${country.flag} ${country.name}`;

card.onclick = () => showCountry(country);

container.appendChild(card);
});

}function showCountry(country) {

let discovered =
JSON.parse(
localStorage.getItem("discoveredCountries")
) || [];

if(!discovered.includes(country.id)){

    discovered.push(country.id);

    localStorage.setItem(
        "discoveredCountries",
        JSON.stringify(discovered)
    );

    updateProgress();
}

document.getElementById("countryInfo")
.innerHTML = `

<h2>${country.flag} ${country.name}</h2>

<p>"${country.quote}"</p>

<b>${country.author}</b>

`;

}
function updateProgress(){

const discovered =
JSON.parse(
localStorage.getItem(
"discoveredCountries"
)
) || [];

document.getElementById(
"discoveryProgress"
).textContent =

`${discovered.length}
/
${countries.length}`;

}
document
.getElementById("countrySearch")
.addEventListener("input", e => {

const search =
e.target.value.toLowerCase();

const filtered =
countries.filter(country =>

country.name
.toLowerCase()
.includes(search)

);

renderCountries(filtered);

});
document
.getElementById("randomCountryBtn")
.addEventListener("click", () => {

const random =
countries[
Math.floor(
Math.random() *
countries.length
)
];

showCountry(random);

});
loadDailyQuote();
renderCountries(countries);
updateProgress();
