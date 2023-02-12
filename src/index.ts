import { PrismaClient } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.raw({ type: "application/vnd.custom-type" }));
app.use(express.text({ type: "text/html" }));

app.get("/workouts", async (req, res) => {
  const todos = await prisma.workouts.findMany({
    orderBy: { workout_number: "asc" },
  }
  );

  res.json(todos);
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body as { username: string, password: string };

  // get userId from username
  const user = await prisma.users.findUnique({
    where: { username: username },
  });
  return res.json(user); 
})






app.get("/", async (req, res) => {
  res.send(
    `
  <h1>Workouts REST API</h1>
  `.trim(),
  );
});

app.listen(Number(port), "0.0.0.0", () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
