import {Vendor} from "./vendor";
import {getAccounts, saveAccounts, updateBalancesUI, updateBalancesExcel} from "./account";
import {notify} from "./ui";

/** Payment record model */
export interface Payment {
    vendor: string;
    account: string;
    amount: number;
    date: string;
}

/**
 * Handles vendor payment logic, updates balances,
 * saves payment record, refreshes Excel and UI.
 */
export function makePayment(vendorName: string, amount: number): void {
    try {
        // --- Validate input ---
        if (!vendorName?.trim()) {
            notify("Please select a vendor.");
            return;
        }
        if (isNaN(amount) || amount <= 0) {
            notify("Please enter a valid payment amount.");
            return;
        }

        // --- Load vendor data ---
        const vendors: Vendor[] = JSON.parse(localStorage.getItem("vendors") || "[]");
        const vendor = vendors.find(v => v.name === vendorName);

        if (!vendor) {
            notify(`Vendor "${vendorName}" not found.`);
            return;
        }

        // --- Get accounts ---
        const accounts = getAccounts();
        const accountKey = vendor.account as "A" | "B";

        if (accounts[accountKey] < amount) {
            notify(`Insufficient funds in Account ${accountKey}.`);
            return;
        }

        // --- Deduct from account ---
        accounts[accountKey] -= amount;
        saveAccounts(accounts);

        // --- Record payment history ---
        let payments: Payment[] = [];
        try {
            payments = JSON.parse(localStorage.getItem("payments") || "[]");
            if (!Array.isArray(payments)) payments = [];
        } catch {
            payments = [];
        }

        const newPayment: Payment = {
            vendor: vendor.name,
            account: vendor.account,
            amount,
            date: new Date().toISOString(),
        };

        payments.push(newPayment);
        localStorage.setItem("payments", JSON.stringify(payments));

        // --- Update UI and Excel ---
        updateBalancesUI();

        // Slight delay so Excel API is ready (avoids RichApi errors)
        setTimeout(() => {
            updateBalancesExcel();
        }, 600);

        // --- Success feedback ---
        notify(`💰 Payment of $${amount.toLocaleString()} made to ${vendor.name} from Account ${vendor.account}.`);
        console.log("✅ Payment recorded:", newPayment);
    } catch (err) {
        console.error("❌ Error in makePayment:", err);
        notify("⚠️ An unexpected error occurred while processing the payment.");
    }
}
