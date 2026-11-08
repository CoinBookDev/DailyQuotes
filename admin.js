const message = document.getElementById("message");

document
    .getElementById("loginButton")
    .addEventListener("click", login);

async function login() {

    message.textContent =
        Object.keys(supabase).join(", ");

}
    message.textContent =
        "supabase=" + typeof supabase +
        " | auth=" + typeof supabase.auth;

}

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
