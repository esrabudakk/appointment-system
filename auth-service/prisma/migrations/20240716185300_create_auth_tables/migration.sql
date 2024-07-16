-- CreateTable
CREATE TABLE "Customers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "secureSalt" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" INTEGER,

    CONSTRAINT "Customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Clients" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "clientName" TEXT NOT NULL,
    "clientType" TEXT NOT NULL,
    "taxNumber" TEXT NOT NULL,
    "taxOffice" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "isApproved" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" INTEGER,

    CONSTRAINT "Clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientUsers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "secureSalt" TEXT NOT NULL,
    "clientId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" INTEGER,

    CONSTRAINT "ClientUsers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customers_email_key" ON "Customers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Customers_phone_key" ON "Customers"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Clients_taxNumber_key" ON "Clients"("taxNumber");

-- CreateIndex
CREATE UNIQUE INDEX "ClientUsers_email_key" ON "ClientUsers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ClientUsers_phone_key" ON "ClientUsers"("phone");

-- AddForeignKey
ALTER TABLE "ClientUsers" ADD CONSTRAINT "ClientUsers_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
