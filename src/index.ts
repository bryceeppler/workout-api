import { PrismaClient } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.raw({ type: "application/vnd.custom-type" }));
app.use(express.text({ type: "text/html" }));

app.get("/workouts", async (req, res) => {
  const workouts = await prisma.workouts.findMany({
    orderBy: { workout_number: "asc" },
  });

  // return "success", and "workouts": []
  let response = {
    success: true,
    workouts: workouts,
  };
  return res.json(response);
});

app.get("/incompleteworkouts/:id", async (req, res) => {
  // getIncompleteWorkouts: publicProcedure
  // .input(z.object({ id: z.number() }))
  // .query(({ ctx, input }) => {
  //   return ctx.prisma.workouts.findMany({
  //     where: {
  //       completedWorkouts: {
  //         every: {
  //           userId: {
  //             not: input.id,
  //           },
  //         },
  //       },
  //     },
  //     orderBy: {
  //       workout_number: "asc",
  //     },
  //   });
  // }),

  const id = req.params.id;
  const workouts = await prisma.workouts.findMany({
    where: {
      completedWorkouts: {
        every: {
          userId: {
            not: Number(id),
          },
        },
      },
    },
    orderBy: {
      workout_number: "asc",
    },
  });

  // return "success", and "workouts": []
  let response = {
    success: true,
    workouts: workouts,
  };
  return res.json(response);
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body as {
    username: string;
    password: string;
  };

  // get userId from username
  const user = await prisma.users.findUnique({
    where: { username: username },
  });

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  } else {
    return res.json(user);
  }
});

app.get("/user/stats/", async (req, res) => {
  // get all users stats
  const users = await prisma.users.findMany({
    select: {
      id: true,
      username: true,
    },
  });

  // get all coldPlunges
  const coldPlunges = await prisma.icePlunge.findMany();
  const completedWorkouts = await prisma.completedWorkouts.findMany({
    where: {
      status: {
        equals: "completed",
      },
    },
  });

  const cardioSessions = await prisma.cardioSession.findMany({
    where: {
      duration: {
        gt: 10,
      },
    },
  });

  // For each user create an object like this
  // {
  //   id: 1,
  //  username: "test",
  //  coldPlunges: 10,
  //  completedWorkouts: 10,
  //  cardioSessions: 10
  // totalPoints: 30
  // }

  let newUserList = [];
  for (let user of users) {
    let newUser = {
      id: user.id,
      username: user.username,
      coldPlunges: 0,
      completedWorkouts: 0,
      cardioSessions: 0,
      totalPoints: 0,
    };

    for (let coldPlunge of coldPlunges) {
      if (coldPlunge.userId === user.id) {
        newUser.coldPlunges += 1;
      }
    }

    for (let completedWorkout of completedWorkouts) {
      if (completedWorkout.userId === user.id) {
        newUser.completedWorkouts += 1;
      }
    }

    for (let cardioSession of cardioSessions) {
      if (cardioSession.userId === user.id) {
        newUser.cardioSessions += 1;
      }
    }

    newUser.totalPoints =
      newUser.coldPlunges + newUser.completedWorkouts + newUser.cardioSessions;

    newUserList.push(newUser);
  }

  const stats = {
    success: true,
    users: newUserList,
  };

  return res.json(stats);
});

app.get("/", async (req, res) => {
  const response = {
    success: true,
    message: "Welcome to the API",
  };
  return res.json(response);
});

app.listen(Number(port), "0.0.0.0", () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.post("/completeWorkout", async (req, res) => {
  // // accept a workout id and user id and create a completedWorkout entry with the given status
  // // return the completedWorkout entry
  const { id, userId, status, title } = req.body as {
    id: number;
    userId: number;
    status: string;
    title: string;
  };

  const completedWorkout = await prisma.completedWorkouts.create({
    data: {
      workoutId: id,
      userId: userId,
      status: status,
      title: title,
    },
  });

  return res.json({ success: true, message: "Workout completed" });
});

app.post("/createIcePlunge", async (req, res) => {
  const { uid, duration, date } = req.body as {
    uid: number;
    duration: number;
    date: string;
  };

  // create date from string
  const dateObject = new Date(date)
  const icePlunge = await prisma.icePlunge.create({
    data: {
      userId: uid,
      duration: duration,
      date: dateObject,
    },
  });

  return res.json({ success: true, message: "Ice Plunge created" });
});

app.post("/createCardioSession", async (req, res) => {
  const { uid, duration, date } = req.body as {
    uid: number;
    duration: number;
    date: string;
  };
  const dateObject = new Date(date)


  const cardioSession = await prisma.cardioSession.create({
    data: {
      userId: uid,
      duration: duration,
      date: dateObject,
    },
  });

  return res.json({ success: true, message: "Cardio Session created" });

});
