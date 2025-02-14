-- CreateTable
CREATE TABLE "Stock" (
    "id" SERIAL NOT NULL,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "series" TEXT NOT NULL,
    "dateOfListing" TIMESTAMP(3) NOT NULL,
    "paidUpValue" INTEGER NOT NULL,
    "marketLot" INTEGER NOT NULL,
    "isinNumber" TEXT NOT NULL,
    "faceValue" INTEGER NOT NULL,
    "sector" TEXT,

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Stock_symbol_key" ON "Stock"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "Stock_isinNumber_key" ON "Stock"("isinNumber");
