const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const app = express();
const htmlparser2 = require("htmlparser2");

app.use(express.json());
const PORT = 3000;
app.disable("x-powered-by");

const pageURL = "https://www.theguardian.com/international";
const cineMaterialURL = "https://www.cinematerial.com/";

app.get("/", (req, res) => {
  console.log("get accessed");
  res.status(200).send({ message: "Okay" });
});

app.get("/getImages", (req, res) => {
  getImages();
  res.send("okay");
});
app.get("/getImages2", async (req, res) => {
  fetchData();
  res.status(200).send("okay");
});

let movies = [{}];
// axios(pageURL).then((res) => {
//   const html = res.data;
//   const $ = cheerio.load(html);
//   $(".fc-container__title__text", html).each(function () {
//     let title = $(this).text();
//     console.log(title.trim());
//   });
// });

async function getImages() {
  axios(cineMaterialURL).then((res) => {
    const html = res.data;
    const $ = cheerio.load(html);
    $(".lazy", html).each(function () {
      let src = $(this).attr("data-src");
      let title = $(this).attr("alt");
      movies.push({
        id: Math.random().toString(36).substring(2),
        title: title,
        url: src,
      });
    });
    writeToJSON(movies);
  });
}

// function getImages2() {
//   const URL = "";
//   axios(URL).then((res) => {
//     const html = res.data;
//     const $ = cheerio.load(html, {
//       xml: {
//         xmlMode: true,
//         withStartIndices: true,
//       },
//     });
//     let test = $("#custom-img").eq(2);
//     console.log(test);
//   });

//   console.log("finished");
// }

async function writeToJSON(data) {
  fs.writeFile("./movies.json", JSON.stringify(data), (err) => {
    if (err) {
      console.error(err);
    }
    console.log("written successfully");
  });
}

let kabumProducts = [];

async function getProducts() {
  //prettier-ignore
  let items = []
  //prettier-ignore
  let scrapURL = "https://www.aliexpress.com/w/wholesale-gtx.html?SearchText=gtx&catId=0&initiative_id=SB_20230204140857&spm=a2g0o.productlist.1000002.0&trafficChannel=seo&g=y&page=2";
  const res = await axios.get(scrapURL);
  const html = await res.data;
  const $ = cheerio.load(html);
  $("..manhattan--price-sale--1CCSZfK").each(function () {
    let title = $(this).find(".promotion-item__img").attr("alt");
    let price = $(this)
      .find(
        "span.andes-money-amount.andes-money-amount--cents-superscript > span.andes-money-amount__fraction"
      )
      .text();
    items.push({ title, price });
  });
  console.log(items);
}

app.get("/products", (req, res) => {
  getProducts();
  res.send("Okay");
});

app.listen(PORT, function () {
  console.log(`Listening on ${PORT}.
	url: http://localhost:${PORT}/`);
});

// document.querySelector("#root-app > div > section:nth-child(2) > div > div.promotions_boxed-width > div > ol > li:nth-child(29) > )
// document.querySelector("#root-app > div > section:nth-child(2) > div > div.promotions_boxed-width > div > ol > li:nth-child(46) > div > a > div > div.promotion-item__description > div.andes-money-amount-combo.promotion-item__price.hasnot-discount > div > span > span.andes-money-amount__fraction")
// document.querySelector("#root-app > div > section:nth-child(2) > div > div.promotions_boxed-width > div > ol > li:nth-child(29)")
