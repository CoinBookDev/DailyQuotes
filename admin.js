
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
