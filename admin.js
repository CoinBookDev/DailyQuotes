const message = document.getElementById("message");

document
    .getElementById("loginButton")
    .addEventListener("click", login);

async function login() {

    message.textContent = "Step 1";

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;

    message.textContent = "Step 2";

    try {

        message.textContent =
    "supabase: " + typeof supabase;
        return;

        const result =
            await supabase.auth.signInWithPassword({
                email,
                password
            });

        message.textContent = "Step 4";

        console.log(result);

        if (result.error) {

            message.textContent =
                "ERROR: " + result.error.message;

            return;
        }

        message.textContent =
            "SUCCESS";

    } catch (err) {

        message.textContent =
            "CRASH: " + err.message;
    }
}
