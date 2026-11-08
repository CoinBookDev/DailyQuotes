const message = document.getElementById("message");

document
    .getElementById("loginButton")
    .addEventListener("click", login);

async function login() {

    message.textContent =
        "supabase=" + typeof supabase +
        " | auth=" + typeof supabase.auth;

}
