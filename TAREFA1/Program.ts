import { promises as fs } from "fs";

type List = (string | number)[];

async function GetData(file: string): Promise<string[]> {
  const data = await fs.readFile(file);

  return Buffer.from(data).toString().replace(new RegExp('"', 'g'), '').split(/\r?\n/);
}

async function DoublePopulation(data: string[]): Promise<List[]> {
  const newData = data.map(line => {
    if (typeof (line) !== "string") return line;

    let [city, population] = line.split("; ") as List;

    if (!isNaN(-population)) {
      population = Number(population) * 2;
    }
    return [city, population];
  })

  return newData;
}

async function CreateCSV(data: List[]): Promise<void> {
  const table = data.map(line => {
    return line.join("; ");
  })

  const fullText = table.join('\n');

  try {
    await fs.writeFile('TAREFA1/answer.csv', fullText);
    console.log('Arquivo CSV salvo com sucesso!');
  } catch (err) {
    console.error('Erro ao salvar arquivo CSV:', err);
  }
}

async function Challenge1() {
  const data = await GetData("mapa.csv");
  const doubledPopulation = await DoublePopulation(data);
  await CreateCSV(doubledPopulation);
}

Challenge1()