/**
 * RINGCENTRAL CONTINUOUS 24H DAILY SYNC & SUMMARY ENGINE
 * The Best Rate Insurance (TBRI)
 * Delegates to the secure script in C:\Users\PC\.gemini\config\scripts\tbri_ringcentral_summary.js
 * Credentials are stored securely outside the workspace in C:\Users\PC\.gemini\config\scripts\ringcentral_credentials.json
 */

const { run } = require('C:\\Users\\PC\\.gemini\\config\\scripts\\tbri_ringcentral_summary.js');

if (require.main === module) {
  run().catch(err => {
    console.error('Sync failed:', err);
    process.exit(1);
  });
}

module.exports = { runSync: run };
