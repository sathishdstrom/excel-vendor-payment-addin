import {getAccounts} from "./account";
import {Payment} from "./payment";
import {notify} from "./ui";

/**
 * Generates a combined Excel report showing:
 *  - Vendor payment history
 *  - Account balances
 *  - Timestamp of report creation
 */
export async function generateReport() {
    try {
        const payments: Payment[] = JSON.parse(localStorage.getItem("payments") || "[]");
        const accounts = getAccounts();

        if (!Office.context || typeof Excel === "undefined") {
            notify("⚠️ Excel runtime not ready — please wait or reload.");
            return;
        }

        await Excel.run(async (ctx) => {
            const sheet = ctx.workbook.worksheets.getActiveWorksheet();

            // --- Clear report area ---
            sheet.getUsedRange().clear();

            // --- Write payment history table ---
            const headerRange = sheet.getRange("A1:D1");
            headerRange.values = [["Vendor", "Account", "Amount", "Date"]];
            headerRange.format.font.bold = true;
            headerRange.format.fill.color = "#E3F2FD";

            if (payments.length > 0) {
                const rows = payments.map((p) => [
                    p.vendor,
                    p.account,
                    p.amount,
                    new Date(p.date).toLocaleString(),
                ]);
                const targetRange = sheet.getRange(`A2:D${rows.length + 1}`);
                targetRange.values = rows;
                targetRange.format.autofitColumns();
            } else {
                sheet.getRange("A2").values = [["(No payments recorded)"]];
            }

            // --- Write balances table ---
            sheet.getRange("F1:G1").values = [["Account", "Balance"]];
            sheet.getRange("F2:G3").values = [
                ["A", accounts.A],
                ["B", accounts.B],
            ];
            sheet.getRange("F1:G1").format.font.bold = true;

            // --- Add timestamp ---
            const now = new Date().toLocaleString();
            sheet.getRange("A5").values = [[`Report generated: ${now}`]];

            await ctx.sync();
            console.log("✅ Excel report generated successfully");
            notify("📊 Report generated successfully in Excel.");
        });
    } catch (err) {
        console.error("❌ Failed to generate report:", err);
        notify("⚠️ Error generating report. Check console for details.");
    }
}
