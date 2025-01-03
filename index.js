const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 3000;


app.use(bodyParser.json());
let users = {};

try {
  const data = fs.readFileSync('users.json', 'utf8');
  users = JSON.parse(data);
} catch (err) {
  console.error('Error reading users.json:', err);
}

function saveUsers() {
  fs.writeFile('users.json', JSON.stringify(users, null, 2), (err) => {
    if (err) console.error('Error saving users:', err);
  });
}

app.post('/check_user', (req, res) => {
  const { fingerprint } = req.body;
  const userExists = !!users[fingerprint];
  res.json({ userExists: userExists });
});

app.post('/register', (req, res) => {
  const { fingerprint, name } = req.body;
  if (users[fingerprint]) {
    return res.status(400).json({ success: false, message: 'User already registered' });
  }
  users[fingerprint] = { name: name};
   saveUsers();
  res.json({ success: true });
});
app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
