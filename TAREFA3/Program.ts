import { promises as fs } from "fs";
import fetch from 'node-fetch';

type List = string[];
type viaCepData = {
  cep: string,
  logradouro: string,
  complemento: string,
  bairro: string,
  localidade: string,
  uf: string,
  ibge: string,
  gia: string,
  ddd: string,
  siafi: string
}

async function GetData(file: string): Promise<string[]> {
  const data = await fs.readFile(file);

  return Buffer.from(data).toString().replace(new RegExp('"', 'g'), '').split(/\r?\n/);
}

async function GetAllCEP(data: string[]): Promise<List[]> {
  let cepData = [] as List[];
  cepData.push([data[0]]);

  for (let i = 1; i < data.length - 1; i++) {
    const line = data[i];
    let teste = line.split(";") as List;
    const CEP = teste[0].replace(/\D/g, "");

    if (CEP.length === 8) {
      const dataCEP = await getCepAPI(CEP) as viaCepData;
      const { logradouro, complemento, bairro, localidade, uf, ddd, ibge, gia, siafi } = dataCEP;

      cepData.push([`${CEP};${logradouro};${complemento};${bairro};${localidade};${uf};${ddd};${ibge};${gia}`]);
    } else {
      cepData.push([`${CEP};CEP invalido;null;null;null;null;null;null`]);
    }
  }

  cepData.push([data[data.length - 1]]);
  return cepData;
}

async function getCepAPI(CEP: string) {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${CEP}/json/`);
    const data = await response.json();

    return data as viaCepData;
  } catch (error) {
    console.log("API VIACEP não retornou os dados solicitados.");
  }
}

async function CreateCSV(data: List[]): Promise<void> {
  const table = data.map(line => {
    return line.join("; ");
  })

  const fullText = table.join('\n');

  try {
    await fs.writeFile('TAREFA3/answer.csv', fullText);
    console.log('Arquivo CSV salvo com sucesso!');
  } catch (err) {
    console.error('Erro ao salvar arquivo CSV:', err);
  }
}

async function Challenge3() {
  const data = await GetData("CEPs.csv");
  const AllCEPs = await GetAllCEP(data);
  await CreateCSV(AllCEPs);
}

Challenge3()