import axios from "axios";
import iconv from "iconv-lite";
import { parseStringPromise } from "xml2js";
import prisma from "./prisma";

type CurrencyRate = { id: string; name: string; rate: string };

async function fetchCurrencyRates(): Promise<CurrencyRate[]> {
  const { data } = await axios.get("http://www.cbr.ru/scripts/XML_daily.asp", {
    responseType: "arraybuffer",
    responseEncoding: "binary",
  });
  return mapResponse(data);
}

async function mapResponse(data: string): Promise<CurrencyRate[]> {
  const decodedData = iconv.decode(Buffer.from(data), "windows-1251");
  const result = await parseStringPromise(decodedData);

  return result.ValCurs.Valute.map((valute: any) => ({
    id: valute["$"].ID,
    name: valute.Name[0],
    rate: valute.Value[0].replace(",", "."),
  }));
}

export async function updateCurrencyRates() {
  const rates = await fetchCurrencyRates();
  await Promise.all(
    rates.map(({ id, name, rate }) =>
      prisma.currency.upsert({
        where: { id },
        update: { rate: parseFloat(rate), name },
        create: { id, name, rate: parseFloat(rate) },
      })
    )
  );
}

process.on("exit", async () => await prisma.$disconnect());
