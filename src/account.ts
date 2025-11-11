export interface Accounts {
    A: number;
    B: number;
}

/**
 * Retrieve accounts from localStorage, or initialize defaults.
 */
export function getAccounts(): Accounts {
    return JSON.parse(localStorage.getItem("accounts") || '{"A":200000,"B":200000}');
}

/**
 * Save accounts back to localStorage.
 */
export function saveAccounts(a: Accounts) {
    localStorage.setItem("accounts", JSON.stringify(a));
}

/**
 * Update account balances in the HTML panel.
 */
export function updateBalancesUI() {
    const a = getAccounts();
    const d = document.getElementById("balances");
    if (d) {
        d.innerHTML = `
        <h4>Account Balances</h4>
        <table border="1" style="width:100%;margin-top:5px;">
            <tr><th>Account</th><th>Balance</th></tr>
            <tr><td>A</td><td>$${a.A.toLocaleString()}</td></tr>
            <tr><td>B</td><td>$${a.B.toLocaleString()}</td></tr>
        </table>`;
    }
}

/**
 * Update the balances and payment history in Excel.
 */
export async function updateBalancesExcel() {
    try {
        const a = getAccounts();

        // Ensure Excel runtime is ready
        if (!Office.context || typeof Excel === "undefined") {
            console.warn("⚠️ Excel runtime not ready — retrying in 1s...");
            setTimeout(updateBalancesExcel, 1000);
            return;
        }

        await Excel.run(async (ctx) => {
            const sheet = ctx.workbook.worksheets.getActiveWorksheet();

            // ✅ Clear only our working range
            sheet.getRange("F1:H100").clear();

            // --- Balances Section ---
            sheet.getRange("F1:G1").values = [["Account", "Balance"]];
            sheet.getRange("F2:G3").values = [
                ["A", a.A],
                ["B", a.B]
            ];
            sheet.getRange("F1:G1").format.font.bold = true;

            // Timestamp
            const now = new Date().toLocaleString();
            sheet.getRange("F5").values = [[`Last Updated: ${now}`]];

            // --- Payment History Section ---
            const payments = JSON.parse(localStorage.getItem("payments") || "[]");

            if (payments.length > 0) {
                sheet.getRange("I1:L1").values = [["Vendor", "Account", "Amount", "Date"]];
                const rows = payments.map((p: any) => [
                    p.vendor,
                    p.account,
                    p.amount,
                    new Date(p.date).toLocaleString(),
                ]);
                const targetRange = sheet.getRange(`I2:L${rows.length + 1}`);
                targetRange.values = rows;

                // Formatting
                sheet.getRange("I1:L1").format.font.bold = true;
                targetRange.format.autofitColumns();
            }

            await ctx.sync();
            console.log("✅ Excel balances and payment history updated successfully");
        });
    } catch (err) {
        console.error("❌ Excel update failed:", err);
    }
}
