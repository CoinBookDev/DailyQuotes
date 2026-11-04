alert("ADMIN.JS HAS LOADED!");
window.onerror = function(message, source, line, column) {

    alert(
        "JAVASCRIPT ERROR:\n" +
        message +
        "\nLine: " + line
    );

};
// ==========================================
// DAILYQUOTES ADMIN
// ==========================================


// ==========================================
// 1. ELEMENTS
// ==========================================

const loginBox = document.getElementById("loginBox");
const adminBox = document.getElementById("adminBox");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const loginButton = document.getElementById("loginButton");
const logoutButton = document.getElementById("logoutButton");


// ==========================================
// 2. HELPER FUNCTIONS
// ==========================================

function showMessage(id, message) {
    const element = document.getElementById(id);

    if (element) {
        element.textContent = message;
    }
}


function showAdmin() {
    loginBox.classList.add("hidden");
    adminBox.classList.remove("hidden");
}


function showLogin() {
    loginBox.classList.remove("hidden");
    adminBox.classList.add("hidden");
}


// ==========================================
// 3. PANEL NAVIGATION
// ==========================================

function showPanel(panelId) {

    document.querySelectorAll(".panel").forEach(panel => {
        panel.classList.add("hidden");
    });

    const selectedPanel = document.getElementById(panelId);

    if (selectedPanel) {
        selectedPanel.classList.remove("hidden");
    }

    document.querySelectorAll(".sidebar-button").forEach(button => {
        button.classList.remove("active");
    });

    const buttons = document.querySelectorAll(".sidebar-button");

    buttons.forEach(button => {

        if (button.getAttribute("onclick")?.includes(panelId)) {
            button.classList.add("active");
        }

    });

}


// Make function available to HTML buttons

window.showPanel = showPanel;


// ==========================================
// 4. ADMIN AUTHORIZATION
// ==========================================

async function checkAdmin() {

    const { data: { user }, error: userError } =
        await supabase.auth.getUser();

    if (userError || !user) {
        showLogin();
        return false;
    }

    // Check whether the logged-in user is an admin

    const { data, error } = await supabase
        .rpc("is_admin");

    if (error || data !== true) {

        await supabase.auth.signOut();

        showLogin();

        showMessage(
            "loginMessage",
            "You do not have admin permissions."
        );

        return false;
    }

    showAdmin();

    return true;
}


// ==========================================
// 5. LOGIN
// ==========================================

loginButton.addEventListener("click", () => {

    alert("JavaScript is working!");

    login();

});


async function login() {

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {

        showMessage(
            "loginMessage",
            "Please enter your email and password."
        );

        return;
    }

    loginButton.disabled = true;
    loginButton.textContent = "Logging in...";

    showMessage("loginMessage", "");

    const { data, error } =
        await supabase.auth.signInWithPassword({
            email,
            password
        });

    if (error) {

        showMessage(
            "loginMessage",
            error.message
        );

        loginButton.disabled = false;
        loginButton.textContent = "Log In";

        return;
    }

    const isAdmin = await checkAdmin();

    if (isAdmin) {

        await loadDashboard();
        await loadQuotes();
        await loadMedia();

    }

    loginButton.disabled = false;
    loginButton.textContent = "Log In";
}


// ==========================================
// 6. LOGOUT
// ==========================================

logoutButton.addEventListener("click", async () => {

    const { error } = await supabase.auth.signOut();

    if (error) {
        alert(error.message);
        return;
    }

    showLogin();

    emailInput.value = "";
    passwordInput.value = "";

    showMessage("loginMessage", "");

});


// ==========================================
// 7. DASHBOARD
// ==========================================

async function loadDashboard() {

    // TOTAL QUOTES

    const { count: quotesCount, error: quotesError } =
        await supabase
            .from("quotes")
            .select("*", {
                count: "exact",
                head: true
            });

    document.getElementById("quoteCount").textContent =
        quotesError ? "Error" : quotesCount;


    // TOTAL MEDIA

    const { count: mediaCount, error: mediaError } =
        await supabase
            .from("media_posts")
            .select("*", {
                count: "exact",
                head: true
            });

    document.getElementById("mediaCount").textContent =
        mediaError ? "Error" : mediaCount;


    // NEXT QUOTE

    const today = new Date().toLocaleDateString("en-CA");

    const { data: nextQuote, error: nextError } =
        await supabase
            .from("quotes")
            .select("quote, author, quote_date")
            .gte("quote_date", today)
            .order("quote_date", {
                ascending: true
            })
            .limit(1)
            .maybeSingle();

    if (nextError) {

        document.getElementById("nextQuote").textContent =
            "Error loading quote";

    } else if (nextQuote) {

        document.getElementById("nextQuote").textContent =
            nextQuote.quote + " — " + nextQuote.author;

    } else {

        document.getElementById("nextQuote").textContent =
            "No upcoming quotes";

    }

}


// ==========================================
// 8. LOAD QUOTES
// ==========================================

async function loadQuotes() {

    const quoteList = document.getElementById("quoteList");

    quoteList.textContent = "Loading quotes...";

    const { data, error } = await supabase
        .from("quotes")
        .select("*")
        .order("quote_date", {
            ascending: true
        });

    if (error) {

        quoteList.textContent = error.message;
        return;

    }

    quoteList.replaceChildren();

    if (!data || data.length === 0) {

        quoteList.textContent = "No quotes found.";
        return;

    }

    data.forEach(item => {

        const card = document.createElement("div");

        card.className = "card quote-admin-item";

        const quoteText = document.createElement("h3");
        quoteText.textContent = item.quote;

        const author = document.createElement("p");
        author.textContent = "By: " + (item.author || "Unknown");

        const date = document.createElement("p");
        date.textContent = "Date: " + item.quote_date;

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";

        editButton.addEventListener("click", () => {
            editQuote(item);
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button";

        deleteButton.addEventListener("click", () => {
            deleteQuote(item.quote_date);
        });

        card.append(
            quoteText,
            author,
            date,
            editButton,
            deleteButton
        );

        quoteList.appendChild(card);

    });

}


// ==========================================
// 9. SAVE QUOTE
// ==========================================

document.getElementById("saveButton")
    .addEventListener("click", saveQuote);


async function saveQuote() {

    const date = document.getElementById("date").value;
    const quote = document.getElementById("quote").value.trim();
    const author = document.getElementById("author").value.trim();

    if (!date || !quote) {

        showMessage(
            "quoteMessage",
            "Please enter a date and a quote."
        );

        return;
    }

    const saveButton = document.getElementById("saveButton");

    saveButton.disabled = true;
    saveButton.textContent = "Saving...";

    // Existing database columns:
    // quote_date, quote, author

    const { error } = await supabase
        .from("quotes")
        .upsert(
            {
                quote_date: date,
                quote: quote,
                author: author
            },
            {
                onConflict: "quote_date"
            }
        );

    saveButton.disabled = false;
    saveButton.textContent = "Save Quote";

    if (error) {

        showMessage(
            "quoteMessage",
            "Error: " + error.message
        );

        return;
    }

    showMessage(
        "quoteMessage",
        "Quote saved successfully!"
    );

    document.getElementById("quote").value = "";
    document.getElementById("author").value = "";
    document.getElementById("date").value = "";

    await loadQuotes();
    await loadDashboard();

}


// ==========================================
// 10. EDIT QUOTE
// ==========================================

function editQuote(item) {

    document.getElementById("date").value =
        item.quote_date;

    document.getElementById("quote").value =
        item.quote;

    document.getElementById("author").value =
        item.author || "";

    showPanel("quotesPanel");

    document.getElementById("saveButton").textContent =
        "Update Quote";

    showMessage(
        "quoteMessage",
        "Editing quote from " + item.quote_date
    );

}


// ==========================================
// 11. DELETE QUOTE
// ==========================================

async function deleteQuote(date) {

    const confirmed = confirm(
        "Are you sure you want to delete this quote?"
    );

    if (!confirmed) return;

    const { error } = await supabase
        .from("quotes")
        .delete()
        .eq("quote_date", date);

    if (error) {

        alert("Error deleting quote: " + error.message);
        return;

    }

    await loadQuotes();
    await loadDashboard();

}


// ==========================================
// 12. LOAD MEDIA
// ==========================================

async function loadMedia() {

    const mediaList =
        document.getElementById("mediaAdminList");

    const { data, error } = await supabase
        .from("media_posts")
        .select("*")
        .order("created_at", {
            ascending: false
        });

    if (error) {

        mediaList.textContent =
            "Could not load media: " + error.message;

        return;

    }

    mediaList.textContent =
        data.length + " media posts found.";

}


// ==========================================
// 13. MEDIA UPLOAD
// ==========================================

// Media upload and database insertion will be
// connected after confirming the media_posts columns.

document.getElementById("uploadMediaButton")
    .addEventListener("click", () => {

        showMessage(
            "mediaMessage",
            "Media upload needs the media_posts database column setup."
        );

    });


// ==========================================
// 14. BACKGROUNDS
// ==========================================

// Background selection will be connected
// to the website after choosing its storage method.

document.querySelectorAll(".background-option")
    .forEach(button => {

        button.addEventListener("click", () => {

            showMessage(
                "backgroundMessage",
                "Background selection is not connected yet."
            );

        });

    });


// ==========================================
// 15. ANNOUNCEMENTS
// ==========================================

// Announcement saving will be connected
// after confirming the announcements table structure.

document.getElementById("saveAnnouncement")
    .addEventListener("click", () => {

        showMessage(
            "announcementMessage",
            "Announcements are not connected yet."
        );

    });


// ==========================================
// 16. INITIALIZATION
// ==========================================

async function initializeAdmin() {

    try {

        const isAdmin = await checkAdmin();

        if (isAdmin) {

            await loadDashboard();
            await loadQuotes();
            await loadMedia();

        }

   } catch (error) {

    showLogin();

    showMessage(
        "loginMessage",
        "ERROR: " + error.message
    );

}
    

    }

}


// Start admin

initializeAdmin();
