-- CreateTable
CREATE TABLE "public"."Media" (
    "id" TEXT NOT NULL,
    "asset_id" TEXT NOT NULL,
    "public_id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "thumbnail_url" TEXT NOT NULL,
    "alt" TEXT,
    "title" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Media_deletedAt_idx" ON "public"."Media"("deletedAt");
