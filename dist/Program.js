import readline from "readline";
import fs from "fs";
const line = readline.createInterface({
    input: fs.createReadStream("mapa.csv")
});
line.on("line", (data) => {
    console.log(data);
});
//TODO:criar função
//TODO:pegar o arquivo, e transformar numa array de objetos
//TODO:multiplicar o valor conforme enunciado
//TODO:transformar array em um arquivo mais uma vez
//TODO:salvar um novo arquivo com as alterações em "TAREFA1"
