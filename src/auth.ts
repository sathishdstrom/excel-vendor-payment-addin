import {notify} from "./ui";

export function login(username: string, password: string): void {

    const validUser = "admin";
    const validPass = "1234";

    // --- Check credentials ---
    if (username === validUser && password === validPass) {
        // Save user session
        localStorage.setItem("user", JSON.stringify({username}));

        // Hide login and show main content
        const loginSection = document.getElementById("login-section");
        const mainSection = document.getElementById("main-section");

        if (loginSection) loginSection.style.display = "none";
        if (mainSection) mainSection.style.display = "block";

        notify("Login successful!");
    } else {
        notify("Invalid credentials. Try admin / 1234");
    }
}

export function logout(): void {
    localStorage.removeItem("user");
    location.reload();
}
