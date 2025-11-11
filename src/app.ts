import {login, logout} from "./auth";
import {addVendor} from "./vendor";
import {makePayment} from "./payment";
import {generateReport} from "./report";
import {displayVendorHistory} from "./history";
import {initSeedData} from "./seed";
import {updateBalancesUI, updateBalancesExcel} from "./account";
import {notify} from "./ui";

/**
 * 🔁 Refresh vendor dropdowns dynamically and safely
 */
function refreshVendorDropdowns() {
    const vendors = JSON.parse(localStorage.getItem("vendors") || "[]") as { name: string }[];
    const vendorSelect = document.getElementById("vendor-select") as HTMLSelectElement | null;
    const historyVendorSelect = document.getElementById("history-vendor-select") as HTMLSelectElement | null;

    if (vendorSelect && historyVendorSelect) {
        vendorSelect.innerHTML = `<option value="">Select Vendor</option>`;
        historyVendorSelect.innerHTML = `<option value="">Select Vendor</option>`;

        vendors.forEach((v) => {
            vendorSelect.innerHTML += `<option value="${v.name}">${v.name}</option>`;
            historyVendorSelect.innerHTML += `<option value="${v.name}">${v.name}</option>`;
        });
    }
}

/**
 * ✅ Main entry for Excel Add-in
 */
Office.onReady(async (info) => {
    console.log("Office.js ready:", info.host);

    if (info.host !== Office.HostType.Excel) {
        console.warn("⚠️ Not running in Excel host, skipping initialization.");
        return;
    }

    // Delay initialization slightly for Excel Online
    if (!Office.context || typeof Excel === "undefined") {
        console.warn("Excel runtime not ready — retrying initialization...");
        setTimeout(() => location.reload(), 1500);
        return;
    }

    // --- Initialize defaults ---
    initSeedData();
    updateBalancesUI();
    setTimeout(updateBalancesExcel, 800);

    // Populate vendor dropdowns
    refreshVendorDropdowns();

    // --- LOGIN ---
    document.getElementById("login-btn")?.addEventListener("click", () => {
        const u = (document.getElementById("username") as HTMLInputElement)?.value || "";
        const p = (document.getElementById("password") as HTMLInputElement)?.value || "";
        login(u, p);
    });

    // --- LOGOUT ---
    document.getElementById("logout-btn")?.addEventListener("click", logout);

    // --- ADD VENDOR ---
    document.getElementById("add-vendor-btn")?.addEventListener("click", () => {
        const name = (document.getElementById("vendor-name") as HTMLInputElement)?.value.trim() || "";
        const account = ((document.getElementById("account-select") as HTMLSelectElement)?.value || "A") as "A" | "B";

        if (!name) {
            notify("Please enter a vendor name.");
            return;
        }

        addVendor(name, account);

        // Clear input field
        (document.getElementById("vendor-name") as HTMLInputElement).value = "";

        // Refresh UI + Excel
        refreshVendorDropdowns();
        updateBalancesUI();
        setTimeout(updateBalancesExcel, 500);

        notify(`✅ Vendor "${name}" added successfully.`);
    });

    // --- MAKE PAYMENT ---
    document.getElementById("pay-btn")?.addEventListener("click", () => {
        const vendor = (document.getElementById("vendor-select") as HTMLSelectElement)?.value || "";
        const amount = parseFloat((document.getElementById("payment-amount") as HTMLInputElement)?.value || "0");

        if (!vendor) {
            notify("Please select a vendor.");
            return;
        }
        if (isNaN(amount) || amount <= 0) {
            notify("Enter a valid payment amount.");
            return;
        }

        makePayment(vendor, amount);

        // Clear input field
        (document.getElementById("payment-amount") as HTMLInputElement).value = "";

        // Update UI + Excel
        updateBalancesUI();
        setTimeout(updateBalancesExcel, 500);

        notify(`💰 Payment of $${amount.toLocaleString()} made to ${vendor}.`);
    });

    // --- VIEW HISTORY ---
    document.getElementById("view-history-btn")?.addEventListener("click", () => {
        const vendor = (document.getElementById("history-vendor-select") as HTMLSelectElement)?.value || "";
        if (!vendor) {
            notify("Select a vendor to view history.");
            return;
        }

        displayVendorHistory(vendor);
        (document.getElementById("history-vendor-select") as HTMLSelectElement).selectedIndex = 0;
    });

    // --- GENERATE REPORT ---
    document.getElementById("report-btn")?.addEventListener("click", generateReport);

    // --- CLEAR ALL DATA ---
    document.getElementById("clear-data-btn")?.addEventListener("click", () => {
        localStorage.clear();
        notify("Local data cleared. Reloading...");
        location.reload();
    });

    console.log("✅ Vendor Payment Manager initialized successfully.");
});
