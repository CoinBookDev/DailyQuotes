const message = document.getElementById("message");

document
    .getElementById("loginButton")
    .addEventListener("click", login);

async function login() {

    message.textContent = "Trying login...";

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;

    const { data, error } =
        await supabase.auth.signInWithPassword({
            email,
            password
        });

    if (error) {
        message.textContent =
            "ERROR: " + error.message;
        return;
    }

    message.textContent =
        "SUCCESS: " + data.user.email;
}
