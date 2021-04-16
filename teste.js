const lista = require('./links').pageUrls
const fs = require('fs')
const puppeteer = require('puppeteer');

const requisicao = async(endereco) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(endereco);
  const result = await page.evaluate(() => {
  const siteswap = document.querySelector("#otherinfo > li:nth-child(1)").innerText
  const difficult = document.querySelector("#otherinfo > li:nth-child(2)").innerText
  const preRequisites = document.querySelector("#otherinfo > li:nth-child(3)").innerText
  let description = document.getElementById('description').innerHTML

   regex = /(&nbsp;){2,}/g;
   description = description.replace(regex, '<p>')

   regex = /[.](<br>)+/g;
   description = description.replace(regex, '.</p>') 

   regex = /<img/g;
   description = description.replace(regex, '</p><img') 

   regex = /<\/p><\/p>/g;
   description = description.replace(regex, '</p>')
   
   regex = /(<br>)/g;
   description = description.replace(regex, '')

   regex = /[\n]/g;
   description = description.replace(regex, '')

   regex = /\&quot;/g;
   description = description.replace(regex, '')

   regex = /<a.+?>/g;
   description = description.replace(regex, '')

   regex = /<\/a>/g;
   description = description.replace(regex, '')

   regex = /.$/g;
   description = description.replace(regex, '</p>')

   regex = /[\t]/g;
   description = description.replace(regex, '')

  description = new DOMParser().parseFromString(description, 'text/html');
  let descripcao = [];
  description.body.childNodes.forEach((a, index) => {
      descripcao.push({
        tag: a.tagName,
        texto: a.tagName === 'P' ? a.innerHTML : a.src  
      });
  })

         return {
          name: document.getElementById('Trickname').innerText,
          image: document.querySelector('#jugglinganimation').src,
          siteswap: siteswap.replace(new RegExp("Siteswap:."), ''),
          difficult: difficult.replace(new RegExp("Difficulty.+:"), ''),
          preRequisites: preRequisites.replace(new RegExp("Prerequisites:."), ''),
          balls: '3',
          description: descripcao
        }
  })
  await browser.close();
  return result;
};

//corta um pedaço da lista, para fazer testes apenas com esse pedaço
const novaLista = lista.slice(150,175)
const truques = []

async function allTricks() {
  for (const [index, item] of novaLista.entries() ) {
    await requisicao(item).then((value) => {
        truques.push(value)
    })
  }
}

function escreverJson() {
  fs.writeFile('dados.json', JSON.stringify(truques), (err) =>  console.log(err))
}

allTricks().then(() => escreverJson())
