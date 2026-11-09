
const loginScreen = document.getElementById("loginScreen");
const adminPanel = document.getElementById("adminPanel");
const loginMessage = document.getElementById("loginMessage");

const loginButton = document.getElementById("loginButton");
const logoutButton = document.getElementById("logoutButton");


// ==========================================
// 1. SHOW ADMIN PANEL
// ==========================================

function showAdminPanel() {
    loginScreen.style.display = "none";
    adminPanel.style.display = "block";

    loadQuotes();
}
function updateDashboardStats() {

    const today = new Date().toISOString().split("T")[0];

    const totalQuotes = quotes.length;

    const futureQuotes = quotes.filter(
        q => q.quote_date >= today
    ).length;

    const pastQuotes = quotes.filter(
        q => q.quote_date < today
    ).length;

    const categories = new Set(
        quotes
            .map(q => q.category)
            .filter(Boolean)
    ).size;

    document.getElementById("totalQuotes").textContent =
        totalQuotes;

    document.getElementById("futureQuotesCount").textContent =
        futureQuotes;

    document.getElementById("pastQuotesCount").textContent =
        pastQuotes;

    document.getElementById("categoryCount").textContent =
        categories;
}

// ==========================================
// 2. SHOW LOGIN SCREEN
// ==========================================

function showLoginScreen() {
    loginScreen.style.display = "flex";
    adminPanel.style.display = "none";
}


// ==========================================
// 3. LOGIN
// ==========================================

loginButton.addEventListener("click", login);

async function login() {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    loginMessage.textContent = "Trying login...";

    loginButton.disabled = true;

    try {

        const { data, error } =
            await supabaseClient.auth.signInWithPassword({
                email,
                password
            });

        if (error) {
            loginMessage.textContent = "ERROR: " + error.message;
            return;
        }

        loginMessage.textContent = "";

        showAdminPanel();

        console.log("Logged in:", data.user.email);

    } catch (err) {

        loginMessage.textContent = "CRASH: " + err.message;

    } finally {

        loginButton.disabled = false;

    }
}


// ==========================================
// 4. LOGOUT
// ==========================================

logoutButton.addEventListener("click", logout);

async function logout() {

    const { error } = await supabaseClient.auth.signOut();

    if (error) {
        console.error("Logout error:", error.message);
        return;
    }

    document.getElementById("password").value = "";

    showLoginScreen();

}


// ==========================================
// 5. NAVIGATION
// ==========================================

const navigationButtons =
    document.querySelectorAll(".nav-button");

const pages =
    document.querySelectorAll(".page");

navigationButtons.forEach(button => {

    button.addEventListener("click", () => {

        const targetPage = button.dataset.page;

        // Remove active state from all buttons

        navigationButtons.forEach(nav => {
            nav.classList.remove("active");
        });

        // Activate selected button

        button.classList.add("active");

        // Hide all pages

        pages.forEach(page => {
            page.classList.remove("active");
        });

        // Show selected page

        document.getElementById(targetPage)
            .classList.add("active");

    });

});


// ==========================================
// 6. RESTORE EXISTING SESSION
// ==========================================

async function checkSession() {

    try {

        const { data, error } =
            await supabaseClient.auth.getSession();

        if (error) {
            console.error(error.message);
            showLoginScreen();
            return;
        }

        if (data.session) {
            showAdminPanel();
        } else {
            showLoginScreen();
        }

    } catch (err) {

        console.error("Session error:", err);
        showLoginScreen();

    }

}

checkSession();

// ==========================================
// 7. QUOTE MANAGEMENT
// ==========================================

let quotes = [];
let editingQuoteId = null;


// ==========================================
// 8. LOAD QUOTES
// ==========================================


async function loadQuotes() {

    const quoteList = document.getElementById("quoteList");

    console.log("1. loadQuotes started");

    quoteList.textContent = "Loading quotes...";

    try {

        console.log("2. Connecting to Supabase...");

        const { data, error } = await supabaseClient
            .from("quotes")
            .select("*")
            .order("quote_date", { ascending: false });

        console.log("3. Supabase response received");

        if (error) {
            console.error("SUPABASE ERROR:", error);
            throw error;
        }

        console.log("4. Quotes received:", data);

        quotes = data || [];

        updateCategoryFilter();
        renderQuotes();
        updateDashboardStats();

        console.log("5. Quotes rendered successfully");

    } catch (error) {

        console.error("LOAD QUOTES ERROR:", error);

        quoteList.textContent =
            "ERROR loading quotes: " + error.message;

    }

}



// ==========================================
// 9. DISPLAY QUOTES
// ==========================================

function renderQuotes() {

    const quoteList = document.getElementById("quoteList");

    const search = document
        .getElementById("quoteSearch")
        .value.toLowerCase();

    const category = document
        .getElementById("categoryFilter")
        .value;

    quoteList.replaceChildren();

    const filteredQuotes = quotes.filter(quote => {

        const matchesSearch =
            (quote.quote || "").toLowerCase().includes(search) ||
            (quote.author || "").toLowerCase().includes(search);

        const matchesCategory =
            !category || quote.category === category;

        return matchesSearch && matchesCategory;

    });

    if (filteredQuotes.length === 0) {

        quoteList.textContent = "No quotes found.";
        return;

    }

    filteredQuotes.forEach(quote => {

        const card = document.createElement("div");
        card.className = "quote-card";

        const quoteText = document.createElement("h3");
        quoteText.textContent = '"' + quote.quote + '"';

        const meta = document.createElement("div");
        meta.className = "quote-meta";

        meta.textContent =
            quote.author + " · " +
            quote.category + " · " +
            (quote.quote_date || "");

        const actions = document.createElement("div");
        actions.className = "quote-actions";

        const editButton = document.createElement("button");
        editButton.className = "edit-quote";
        editButton.textContent = "Edit";

        editButton.addEventListener("click", () => {
            editQuote(quote);
        });

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-quote";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            deleteQuote(quote.id);
        });

        actions.append(editButton, deleteButton);

        card.append(quoteText, meta, actions);

        quoteList.appendChild(card);

    });

}


// ==========================================
// 10. CATEGORY FILTER
// ==========================================

function updateCategoryFilter() {

    const filter = document.getElementById("categoryFilter");

    const currentValue = filter.value;

    filter.replaceChildren();

    const allOption = document.createElement("option");
    allOption.value = "";
    allOption.textContent = "All Categories";

    filter.appendChild(allOption);

    const categories = [
        ...new Set(
            quotes.map(q => q.category).filter(Boolean)
        )
    ].sort();

    categories.forEach(category => {

        const option = document.createElement("option");

        option.value = category;
        option.textContent = category;

        filter.appendChild(option);

    });

    filter.value = categories.includes(currentValue)
        ? currentValue
        : "";

}


// ==========================================
// 11. ADD / EDIT QUOTE
// ==========================================

const quoteForm = document.getElementById("quoteForm");

quoteForm.addEventListener("submit", saveQuote);

async function saveQuote(event) {

    event.preventDefault();

    const message = document.getElementById("quoteMessage");
    const saveButton = document.getElementById("saveQuoteButton");

    const quoteData = {

        quote: document.getElementById("quoteText").value.trim(),

        author: document.getElementById("quoteAuthor").value.trim(),

        category: document.getElementById("quoteCategory").value.trim(),

        quote_date: document.getElementById("quoteDate").value

    };

    if (
        !quoteData.quote ||
        !quoteData.author ||
        !quoteData.category ||
        !quoteData.quote_date
    ) {

        message.textContent = "Please complete all fields.";
        return;

    }

    message.textContent = "Saving...";

    saveButton.disabled = true;

    try {

        let result;

        if (editingQuoteId) {

            // UPDATE EXISTING QUOTE

            result = await supabaseClient
                .from("quotes")
                .update(quoteData)
                .eq("id", editingQuoteId);

        } else {

            // INSERT NEW QUOTE

            result = await supabaseClient
                .from("quotes")
                .insert([quoteData]);

        }

        if (result.error) {
            throw result.error;
        }

        message.textContent = editingQuoteId
            ? "Quote updated successfully!"
            : "Quote added successfully!";

        resetQuoteForm();

        await loadQuotes();

    } catch (error) {

        message.textContent =
            "ERROR: " + error.message;

        console.error(error);

    } finally {

        saveButton.disabled = false;

    }

}


// ==========================================
// 12. EDIT QUOTE
// ==========================================

function editQuote(quote) {

    editingQuoteId = quote.id;

    document.getElementById("quoteText").value =
        quote.quote || "";

    document.getElementById("quoteAuthor").value =
        quote.author || "";

    document.getElementById("quoteCategory").value =
        quote.category || "";

    document.getElementById("quoteDate").value =
        quote.quote_date || "";

    document.getElementById("formTitle").textContent =
        "Edit Quote";

    document.getElementById("saveQuoteButton").textContent =
        "Save Changes";

    document.getElementById("cancelEditButton").style.display =
        "inline-block";

    document.getElementById("quoteMessage").textContent = "";

    document.getElementById("quoteForm").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


// ==========================================
// 13. DELETE QUOTE
// ==========================================

async function deleteQuote(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this quote?"
    );

    if (!confirmed) return;

    try {

        const { error } = await supabaseClient
            .from("quotes")
            .delete()
            .eq("id", id);

        if (error) {
            throw error;
        }

        if (editingQuoteId === id) {
            resetQuoteForm();
        }

        await loadQuotes();

    } catch (error) {

        alert("ERROR deleting quote: " + error.message);

        console.error(error);

    }

}


// ==========================================
// 14. RESET FORM
// ==========================================

function resetQuoteForm() {

    quoteForm.reset();

    editingQuoteId = null;

    document.getElementById("formTitle").textContent =
        "Add New Quote";

    document.getElementById("saveQuoteButton").textContent =
        "Add Quote";

    document.getElementById("cancelEditButton").style.display =
        "none";

    document.getElementById("quoteMessage").textContent = "";

}


// ==========================================
// 15. SEARCH AND FILTER EVENTS
// ==========================================

document.getElementById("quoteSearch")
    .addEventListener("input", renderQuotes);

document.getElementById("categoryFilter")
    .addEventListener("change", renderQuotes);

document.getElementById("cancelEditButton")
    .addEventListener("click", resetQuoteForm);
