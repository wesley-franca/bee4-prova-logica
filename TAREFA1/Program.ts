import { promises as fs } from "fs";

async function GetData(file: string): Promise<string[]> {
  const data = await fs.readFile(file);

  return Buffer.from(data).toString().replace(new RegExp('"', 'g'), '').split(/\r?\n/);
}

type List = (string | number)[]

async function DoublePopulation() {
  const data = await GetData("mapa.csv");

  const newData = data.map((line) => {
    let newLine;
    if (typeof (line) === "string") {
      newLine = line.split("; ") as List;

      if (!isNaN(Number(newLine[1]))) {
        newLine[1] = Number(newLine[1]) * 2
      }
      return newLine
    }
  })
}






//TODO: transformar array em um arquivo mais uma vez

//TODO: salvar um novo arquivo com as alterações em "TAREFA1"

DoublePopulation()