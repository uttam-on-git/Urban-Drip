/*
  Warnings:

  - Added the required column `secure_url` to the `Media` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Media" ADD COLUMN     "secure_url" TEXT NOT NULL;
