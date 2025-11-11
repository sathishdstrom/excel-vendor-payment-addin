import {Payment} from "./payment";
import {updateBalancesExcel} from "./account";
import {notify} from "./ui";

/**
 * Displays vendor payment history in the task pane.
 * Also updates Excel to include the payment log.
 */
export function displayVendorHistory(vendorName: string) {
    try {
        const allPayments: Payment[] = JSON.parse(localStorage.getItem("payments") || "[]");

        if (!Array.isArray(allPayments)) {
            console.warn("⚠️ Invalid payment data in localStorage");
            return;
        }

        const vendorPayments = allPayments.filter(p => p.vendor === vendorName);
        const container = document.getElementById("vendor-history");

        if (!container) {
            console.warn("⚠️ Vendor history container not found in DOM");
            notify("Vendor history area not found — please reload the Add-in.");
            return;
        }

        if (vendorPayments.length === 0) {
            container.innerHTML = `<p>No payments found for <strong>${vendorName}</strong>.</p>`;
            return;
        }

        // Build HTML table
        const rowsHtml = vendorPayments
            .map(
                (p) => `
            <tr>
                <td>${p.vendor}</td>
                <td>${p.account}</td>
                <td>$${p.amount.toLocaleString()}</td>
                <td>${new Date(p.date).toLocaleString()}</td>
            </tr>`
            )
            .join("");

        const totalAmount = vendorPayments.reduce((sum, p) => sum + p.amount, 0);

        container.innerHTML = `
            <h4>Payment History for <span style="color:#0078D7">${vendorName}</span></h4>
            <table border="1" style="width:100%;margin-top:10px;border-collapse:collapse;">
                <tr style="background:#F3F3F3;">
                    <th>Vendor</th><th>Account</th><th>Amount</th><th>Date</th>
                </tr>
                ${rowsHtml}
            </table>
            <p style="margin-top:10px;font-weight:bold;">Total: $${totalAmount.toLocaleString()}</p>
        `;

        // Optional: update Excel log area
        setTimeout(() => updateBalancesExcel(), 500);
    } catch (err) {
        console.error("❌ Failed to display vendor history:", err);
        notify("An error occurred while displaying vendor history.");
    }
}
