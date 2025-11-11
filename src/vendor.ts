import {notify} from "./ui";
import {updateBalancesUI, updateBalancesExcel} from "./account";

export interface Vendor {
    name: string;
    account: "A" | "B";
}

/**
 * Add a new vendor to localStorage safely.
 * Prevents duplicates and syncs Excel balances.
 */
export function addVendor(name: string, account: "A" | "B") {
    try {
        // --- Validation ---
        const cleanName = name.trim();
        if (!cleanName) {
            notify("Please enter a valid vendor name.", "error");
            return;
        }

        // --- Load vendor list safely ---
        let vendors: Vendor[] = [];
        try {
            vendors = JSON.parse(localStorage.getItem("vendors") || "[]");
            if (!Array.isArray(vendors)) vendors = [];
        } catch {
            vendors = [];
        }

        // --- Prevent duplicates (case-insensitive) ---
        const exists = vendors.some(
            (v) => v.name.toLowerCase() === cleanName.toLowerCase()
        );
        if (exists) {
            notify(`Vendor "${cleanName}" already exists.`, "error");
            return;
        }

        // --- Save new vendor ---
        const newVendor: Vendor = {name: cleanName, account};
        vendors.push(newVendor);
        localStorage.setItem("vendors", JSON.stringify(vendors));

        // --- UI and Excel update ---
        updateBalancesUI();
        setTimeout(updateBalancesExcel, 400);

        // --- Notify success ---
        notify(`✅ Vendor "${cleanName}" added to Account ${account}.`, "success");
        console.log("Vendor added:", newVendor);
    } catch (err) {
        console.error("❌ Error adding vendor:", err);
        notify("Failed to add vendor. See console for details.", "error");
    }
}
