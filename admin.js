const message = document.getElementById("message");

document
    .getElementById("loginButton")
    .addEventListener("click", login);

async function login() {

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;

    message.textContent =
        "Trying login...";

    try {

        const { data, error } =
            await supabaseClient.auth.signInWithPassword({
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

    } catch (err) {

        message.textContent =
            "CRASH: " + err.message;

    }

}
