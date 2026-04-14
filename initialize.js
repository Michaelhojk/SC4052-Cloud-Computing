async function initialize(chat, environment) {
    chat.reply(`Hello!! I am your Data Visualizer.

I process raw text and spreadsheet cells into structured, downloadable charts. 

**How to provide data (Just paste into message bar):**
1. **Bulk Paste:** Highlight your cells directly in Excel or Google Sheets, copy them, and paste them right into this chat!
2. **Type it manually:** (e.g., 'Graph my sales: Q1 500, Q2 800')

What data would you like to visualize today?`);