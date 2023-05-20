const express = require("express");
const users = require("./mockData.json");
const fs = require("fs");
const app = express();
const PORT = 8000;

app.use(express.urlencoded({ extended: false }));

app.get("/users", (req, res) => {
  const html = `
        <ul>
            ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
        </ul>
    `;

  return res.send(html);
});

app.get("/api/users", (req, res) => {
  return res.json(users);
});

app.get("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.filter((user) => user.id === id);
  return res.json(user);
});

app.post("/api/users", (req, res) => {
  const body = req.body;
  users.push({ id: users.length + 1, ...body });

  fs.writeFile("./mockData.json", JSON.stringify(users), (err) => {
    return res.json(`User added, ${users.length}`);
  });
});

app.delete("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.filter((user) => user.id !== id);

  fs.writeFile("./mockData.json", JSON.stringify(user), (err) => {
    return res.json(`User removed, ${id}`);
  });
});

app.patch("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const userIndex = users.findIndex((user) => user.id === id);
  const body = req.body;

  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  Object.keys(body).forEach((key) => {
    if (key in users[userIndex]) {
      users[userIndex][key] = body[key];
    }
  });

  const updatedUsers = [...users];
  updatedUsers[userIndex] = users[userIndex];

  fs.writeFile("./mockData.json", JSON.stringify(updatedUsers), (err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to update user" });
    }
    return res.json(`User updated: ${id}`);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on PORT:${PORT}`);
});
