#!/usr/bin/env node

const os = require("os");
const { execSync } = require("child_process");

console.log("🌐 MaskMe Network Setup Helper\n");

// Get local IP address
function getLocalIP() {
  const interfaces = os.networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    for (const interface of interfaces[name]) {
      // Skip internal and non-IPv4 addresses
      if (interface.family === "IPv4" && !interface.internal) {
        return interface.address;
      }
    }
  }
  return null;
}

const localIP = getLocalIP();

if (!localIP) {
  console.log("❌ Could not find your local IP address");
  console.log("Please check your network connection and try again.");
  process.exit(1);
}

console.log(`✅ Found your local IP address: ${localIP}\n`);

console.log("📱 To access MaskMe from mobile devices:");
console.log(`   Frontend: http://${localIP}:3000`);
console.log(`   Backend:  http://${localIP}:5000\n`);

console.log("🔧 Set these environment variables:\n");

if (process.platform === "win32") {
  console.log("Windows CMD:");
  console.log(`set FRONTEND_URL=http://${localIP}:3000`);
  console.log(`set BACKEND_URL=http://${localIP}:5000\n`);

  console.log("Windows PowerShell:");
  console.log(`$env:FRONTEND_URL="http://${localIP}:3000"`);
  console.log(`$env:BACKEND_URL="http://${localIP}:5000"\n`);
} else {
  console.log("Mac/Linux:");
  console.log(`export FRONTEND_URL=http://${localIP}:3000`);
  console.log(`export BACKEND_URL=http://${localIP}:5000\n`);
}

console.log("📋 For React frontend, also set:");
if (process.platform === "win32") {
  console.log(`set REACT_APP_BACKEND_URL=http://${localIP}:5000`);
  console.log(`set REACT_APP_FRONTEND_URL=http://${localIP}:3000\n`);
} else {
  console.log(`export REACT_APP_BACKEND_URL=http://${localIP}:5000`);
  console.log(`export REACT_APP_FRONTEND_URL=http://${localIP}:3000\n`);
}

console.log("🚀 Then start your servers:");
console.log("   Backend:  cd backend && npm start");
console.log("   Frontend: cd frontend && npm start\n");

console.log("📱 On your mobile device:");
console.log("   1. Connect to the same WiFi network");
console.log(`   2. Open browser and go to: http://${localIP}:3000`);
console.log("   3. Email verification links will now work on mobile!\n");

console.log(
  "💡 Tip: If you have firewall issues, make sure ports 3000 and 5000 are allowed."
);
