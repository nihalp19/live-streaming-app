-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('USER', 'ADMIN', 'STREAMER');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "avatar" TEXT,
    "role" "public"."Role" NOT NULL DEFAULT 'USER',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resetToken" TEXT,
    "resetTokenExpiry" TIMESTAMP(3),
    "verifyToken" TEXT,
    "verifyTokenExpiry" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Stream" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isLive" BOOLEAN NOT NULL DEFAULT false,
    "thumbnail" TEXT,
    "rtmpUrl" TEXT NOT NULL,
    "streamKey" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Stream_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Viewer" (
    "id" TEXT NOT NULL,
    "streamId" TEXT NOT NULL,
    "userId" TEXT,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Viewer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Stream_streamKey_key" ON "public"."Stream"("streamKey");

-- AddForeignKey
ALTER TABLE "public"."Stream" ADD CONSTRAINT "Stream_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Viewer" ADD CONSTRAINT "Viewer_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "public"."Stream"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Viewer" ADD CONSTRAINT "Viewer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
