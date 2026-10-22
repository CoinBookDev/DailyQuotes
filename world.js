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

const svgObject = document.getElementById("svgMap");

if (svgObject) {

    svgObject.addEventListener("load", () => {

        const svgDoc = svgObject.contentDocument;

        const netherlands =
            svgDoc.getElementById("NL");

        if (netherlands) {

            netherlands.style.fill = "red";

            netherlands.addEventListener(
                "click",
                () => alert("Netherlands works!")
            );

        }

    });

}

/*const container =
document.getElementById("countriesContainer");

function renderCountries(list) {

    if (!container) return;

    container.innerHTML = "";

    list.forEach(country => {

        const card =
            document.createElement("button");

        card.className =
            "country-card";

        card.textContent =
            `${country.flag} ${country.name}`;

        card.addEventListener(
            "click",
            () => showCountry(country)
        );

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

    let quoteText =
        "Quote coming soon";

    let authorText =
        "";

    if (
        typeof worldQuotes !== "undefined" &&
        worldQuotes[country.name]
    ) {

        quoteText =
            worldQuotes[country.name].quote ||
            quoteText;

        authorText =
            worldQuotes[country.name].author ||
            "";

    }

    document.getElementById(
        "countryInfo"
    ).innerHTML = `

        <h2>
            ${country.flag}
            ${country.name}
        </h2>

        <blockquote>
            "${quoteText}"
        </blockquote>

        <p>
            ${authorText}
        </p>

    `;
}*/

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
                countries.filter(
                    country =>
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

if (randomBtn) {

    randomBtn.addEventListener(
        "click",
        () => {

            const random =
                countries[
                    Math.floor(
                        Math.random() *
                        countries.length
                    )
                ];

            showCountry(random);

        }
    );

}

const toggleBtn =
document.getElementById(
    "toggleCountriesBtn"
);

if (toggleBtn) {

    toggleBtn.addEventListener(
        "click",
        () => {

            container.classList.toggle(
                "hidden"
            );

        }
    );

}

//const svgObject =
document.getElementById("svgMap");

if (svgObject) {

    svgObject.addEventListener(
        "load",
        () => {

            const svgDoc =
                svgObject.contentDocument;

            const svgCountries =
    svgDoc.querySelectorAll("[name]");

console.log(svgCountries.length);
                );

            svgCountries.forEach(
                element => {

                    const countryName =
                        element.getAttribute(
                            "name"
                        );
                    element.addEventListener(
    "click",
    () => {

        const countryName =
            element.getAttribute("name");

        alert(countryName);

    }
);

                  /*  const matchingCountry =
                        countries.find(
                            c =>
                            c.name
                            .toLowerCase()
                            ===
                            countryName
                            .toLowerCase()*/
                        );

                    if (!matchingCountry)
                        return;

                    element.style.cursor =
                        "pointer";

                    element.addEventListener(
                        "mouseenter",
                        () => {

                            element.style.fill =
                                "#D6B37F";

                        }
                    );

                    element.addEventListener(
                        "mouseleave",
                        () => {

                            element.style.fill =
                                "";

                        }
                    );

                    element.addEventListener(
                        "click",
                        () => {

                            showCountry(
                                matchingCountry
                            );

                            element.style.fill =
                                "#4CAF50";

                        }
                    );

                }
            );

        }
    );

}

loadDailyQuote();
renderCountries(countries);
updateProgress();
