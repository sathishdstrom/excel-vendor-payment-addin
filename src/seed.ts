import {Vendor} from "./vendor";
import {notify} from "./ui";

/**
 * Initializes localStorage with default accounts, vendors, and payments.
 * Safe to call multiple times — will not create duplicates.
 */
export function initSeedData() {
    try {
        // --- Accounts ---
        const storedAccounts = localStorage.getItem("accounts");
        if (!storedAccounts) {
            localStorage.setItem("accounts", JSON.stringify({A: 200000, B: 200000}));
            console.log("✅ Default accounts initialized.");
        }

        // --- Vendors ---
        const storedVendors = localStorage.getItem("vendors");
        if (!storedVendors) {
            const defaultVendors: Vendor[] = [
                {name: "ABC Supplies", account: "A"},
                {name: "XYZ Contractors", account: "B"},
            ];
            localStorage.setItem("vendors", JSON.stringify(defaultVendors));
            console.log("✅ Default vendors initialized.");
        } else {
            // Clean duplicates if they exist
            try {
                const vendors: Vendor[] = JSON.parse(storedVendors);
                const unique = Array.from(
                    new Map(vendors.map((v) => [v.name.toLowerCase(), v])).values()
                );
                if (unique.length !== vendors.length) {
                    localStorage.setItem("vendors", JSON.stringify(unique));
                    console.log("♻️ Cleaned duplicate vendors.");
                }
            } catch {
                console.warn("⚠️ Invalid vendor data, resetting.");
                localStorage.setItem(
                    "vendors",
                    JSON.stringify([
                        {name: "ABC Supplies", account: "A"},
                        {name: "XYZ Contractors", account: "B"},
                    ])
                );
            }
        }

        // --- Payments ---
        const storedPayments = localStorage.getItem("payments");
        if (!storedPayments) {
            localStorage.setItem("payments", JSON.stringify([]));
            console.log("✅ Empty payments initialized.");
        } else {
            try {
                JSON.parse(storedPayments);
            } catch {
                console.warn("⚠️ Invalid payment data, resetting.");
                localStorage.setItem("payments", JSON.stringify([]));
            }
        }
    } catch (err) {
        console.error("❌ Error initializing seed data:", err);
        notify("Error initializing default data — see console.");
    }
}
