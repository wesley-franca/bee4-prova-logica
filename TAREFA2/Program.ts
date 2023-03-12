import { promises as fs } from "fs";

type List = (string | number)[];

async function GetData(file: string): Promise<string[]> {
  const data = await fs.readFile(file);

  return Buffer.from(data).toString().replace(new RegExp('"', 'g'), '').split(/\r?\n/);
}

async function bubbleSortByPopulation(data: string[]): Promise<List[]> {
  const newData = data.map(line => {
    if (typeof (line) !== "string") return line;
    let [city, population] = line.split("; ") as List;

    if (!isNaN(-population)) {
      population = Number(population);
    }
    return [city, population];
  })

  for (let i = 0; i < newData.length; i++) {
    for (let j = 0; j < newData.length - i - 1; j++) {
      if (newData[j][1] > newData[j + 1][1]) {
        const aux = newData[j];
        newData[j] = newData[j + 1];
        newData[j + 1] = aux;
      }
    }
  }

  return newData;
}

async function CreateCSV(data: List[]): Promise<void> {
  const table = data.map(line => {
    return line.join("; ");
  })

  const fullText = table.join('\n');

  try {
    await fs.writeFile('TAREFA2/answer.csv', fullText);
    console.log('Arquivo CSV salvo com sucesso!');
  } catch (err) {
    console.error('Erro ao salvar arquivo CSV:', err);
  }
}

async function Challenge2() {
  const data = await GetData("mapa.csv");
  const sortedData = await bubbleSortByPopulation(data);
  await CreateCSV(sortedData);
}

Challenge2()