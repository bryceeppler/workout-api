/*
  Warnings:

  - You are about to drop the `Todo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Todo";

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workouts" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR,
    "workout_number" INTEGER,
    "workout_str" VARCHAR,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "completedWorkouts" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "title" VARCHAR,
    "userId" INTEGER NOT NULL,
    "workoutId" INTEGER NOT NULL,
    "status" VARCHAR,

    CONSTRAINT "completedWorkouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "icePlunge" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "duration" INTEGER,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "icePlunge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cardioSession" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "duration" INTEGER,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "cardioSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AddForeignKey
ALTER TABLE "completedWorkouts" ADD CONSTRAINT "completedWorkouts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "completedWorkouts" ADD CONSTRAINT "completedWorkouts_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "workouts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "icePlunge" ADD CONSTRAINT "icePlunge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cardioSession" ADD CONSTRAINT "cardioSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
