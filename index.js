// Entry point for Render when it runs `node index.js`.
// This will load the compiled TypeScript output from ./dist/server.js
// and start the HTTP server. It handles both CommonJS and ES module
// transpiled outputs.

function loadApp() {
  try {
    const mod = require('./dist/server');
    // support both module.exports = app and export default app
    return mod && (mod.default || mod);
  } catch (err) {
    console.error('Failed to load ./dist/server. Make sure you ran the build step:', err);
    process.exit(1);
  }
}

const app = loadApp();
if (!app || typeof app.listen !== 'function') {
  console.error('Loaded module does not export an Express app with listen().');
  process.exit(1);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
