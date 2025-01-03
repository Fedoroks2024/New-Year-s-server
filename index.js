const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

let users = {};
const USERS_FILE = 'users.json'; // Store filename as a constant for easy change

// Function to load users from file, handle errors, and provide fallback
function loadUsers() {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    users = JSON.parse(data);
  } catch (err) {
     if (err.code === 'ENOENT') {
      // If the file doesn't exist, initialize with an empty object (no error)
      console.log('users.json not found, starting with empty user list.');
      users = {};
    } else {
      console.error('Error reading users.json:', err);
        // If it's a different error, try to create a new file if that fails, abort
    try {
        fs.writeFileSync(USERS_FILE, '{}');
        users = {};
        console.log(`Created ${USERS_FILE}, started with empty user list`);

      } catch (createError) {
        console.error("Failed to create users.json:", createError);
        process.exit(1); // Exit the process if file creation fails
      }
    }
  }
}

loadUsers(); // Load users on startup


function saveUsers() {
  fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), (err) => {
    if (err) {
      console.error('Error saving users:', err);
    } else {
      console.log("Users saved to file successfully");
    }
  });
}

app.post('/check_user', (req, res) => {
  const { fingerprint } = req.body;
  const userExists = !!users[fingerprint];
  res.json({ userExists });
});

app.post('/register', (req, res) => {
  const { fingerprint, name } = req.body;
  if (users[fingerprint]) {
    return res.status(400).json({ success: false, message: 'User already registered' });
  }
  users[fingerprint] = { name }; // Use object literal short hand
  saveUsers();
  res.json({ success: true });
});

// Serve static files (e.g. index.html) from the same directory
app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});