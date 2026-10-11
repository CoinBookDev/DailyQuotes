function loadDailyQuote() {

    const today =
        Math.floor(Date.now() / 86400000);

    const country =
        countries[today % countries.length];

    document.getElementById("dailyCountry")
        .textContent =
        `${country.flag} ${country.name}`;

    document.getElementById("dailyQuote")
        .textContent =
        "Click a country on the map to discover it.";
}

const container =
document.getElementById("countriesContainer");

function renderCountries(list) {

    if (!container) return;

    container.innerHTML = "";

    list.forEach(country => {

        const card =
            document.createElement("button");

        card.className = "country-card";

        card.textContent =
            `${country.flag} ${country.name}`;

        card.onclick = () =>
            showCountry(country);

        container.appendChild(card);

    });

}

function showCountry(country) {

    let discovered =
        JSON.parse(
            localStorage.getItem(
                "discoveredCountries"
            )
        ) || [];

    if (!discovered.includes(country.id)) {

        discovered.push(country.id);

        localStorage.setItem(
            "discoveredCountries",
            JSON.stringify(discovered)
        );

        updateProgress();

    }

    document.getElementById(
        "countryInfo"
    ).innerHTML = `

        <h2>
            ${country.flag}
            ${country.name}
        </h2>

        <p>
            Country discovered ✅
        </p>

    `;

}

function updateProgress() {

    const discovered =
        JSON.parse(
            localStorage.getItem(
                "discoveredCountries"
            )
        ) || [];

    document.getElementById(
        "discoveryProgress"
    ).textContent =
        `${discovered.length} / ${countries.length}`;

}

const searchInput =
document.getElementById(
    "countrySearch"
);

if (searchInput) {

    searchInput.addEventListener(
        "input",
        e => {

            const search =
                e.target.value.toLowerCase();

            const filtered =
                countries.filter(country =>
                    country.name
                    .toLowerCase()
                    .includes(search)
                );

            renderCountries(filtered);

        }
    );

}

const randomBtn =
document.getElementById(
    "randomCountryBtn"
);

if (randomBtn
