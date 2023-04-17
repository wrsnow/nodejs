const cheerio = require("cheerio");
const axios = require("axios");
const crypto = require("crypto");
const { appendToJSON, createNewJson } = require("./src/utils/utils");
const JSONData = require("./links.json");

async function scrapURL(url) {
  try {
    let data = [];
    const res = await axios.get(url);
    const html = res.data;
    const $ = cheerio.load(html);
    $(".a-section.a-spacing-base").each(function () {
      let productName = $(this)
        .find(".a-size-base-plus.a-color-base.a-text-normal")
        .text();
      let productPrice = $(this)
        .find("[data-a-color='base'] > .a-offscreen")
        .text();
      data.push({
        name: productName,
        price: productPrice,
      });
    });
    writeScrappedData(data);
  } catch (error) {
    throw new Error(error.message);
  }
}

function writeScrappedData(data) {
  fs.writeFile("amazon_data.json", JSON.stringify(data, null, 2), (err) => {
    if (err) throw err;
    console.log("data written to amazon_data.json");
  });
}

async function scrapDisney() {
  try {
    let data = [];
    const res = await axios.get(
      "https://disneyplusoriginals.disney.com/recent-releases"
    );
    const html = res.data;
    const $ = cheerio.load(html);
    $(".aspect a[data-slug]").each(function () {
      let link = $(this).attr("href");
      data.push({
        id: crypto.randomUUID(),
        link: link,
      });
    });
    appendToJSON("links.json", data);
  } catch (error) {
    throw new Error(error.message);
  }
}

async function scrapLinks(link) {
  try {
    let data = [];
    const res = await axios.get(link);
    const html = res.data;
    const $ = cheerio.load(html);
    let title = "";
    let imgSrc = $(".bound.Show").html();
    let description = $(
      "#ref-1-1 > div > div > div.title.text-light > p"
    ).text();
    console.log(description, imgSrc);
  } catch (error) {
    throw new Error(error.message);
  }
}
// let title = $('.catalog-title').text()
// let img = $('.container.poster.one-column .poster img').getAttribute('src')
// let rating = $('.meta-title.flex-meta-item.flex-meta-rating').text().split(':')[1]
// let releaseDate = $('meta-title.flex-meta-item').text().split(':')[1]
// let rating = $('.meta-title.flex-meta-item.flex-meta-rating').text().split(':')[1]

// (async () => {
//   for (let content of JSONData) {
//     await wait(2000);
//     console.log(content.link);
//   }
// })();

// async function wait(duration) {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve();
//     }, duration);
//   });
// }

scrapLinks("https://disneyplusoriginals.disney.com/show/the-low-tone-club");
