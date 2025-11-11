/**
 * Display a simple message inside Excel taskpane (or console fallback).
 * @param message - The message to show
 * @param type - "success" | "info" | "error"
 */
export function notify(
    message: string,
    type: "success" | "info" | "error" = "info"
) {
    const status = document.getElementById("status");

    if (status) {
        // Color scheme for clarity
        let color = "#0078D7"; // default info (blue)
        if (type === "success") color = "#107C10"; // green
        if (type === "error") color = "#C50F1F"; // red

        status.textContent = message;
        status.style.color = color;
        status.style.fontWeight = "500";

        // Auto-clear after 5 seconds
        clearTimeout((status as any)._timeout);
        (status as any)._timeout = setTimeout(() => {
            status.textContent = "";
        }, 5000);
    } else {
        // Fallback for dev/debug mode
        const prefix =
            type === "error"
                ? "❌"
                : type === "success"
                    ? "✅"
                    : "ℹ️";
        console.log(`${prefix} ${message}`);
    }
}
