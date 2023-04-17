const puppeteer = require("puppeteer");
const crypto = require("crypto");
const { createNewJson, appendToJSON } = require("../src/utils/utils");
const linksJSON = require("./links.json");

// (async () => {
//   let keys = ["Rating", "Release Date", "Genre"];
//   const browser = await puppeteer.launch({ headless: false });
//   const page = await browser.newPage();
//   const baseURL = "www.justwatch.com";

//   await page.goto("https://www.justwatch.com/us/provider/disney-plus");

//   // Set screen size
//   // await page.click('.title-list-grid__item--link');
//   await page.waitForSelector(".title-list-grid__item--link");
//   let elements = await page.$$(".title-list-grid__item--link");
//   for (let i = 0; i < elements.length; i++) {
//     await wait(600);
//     const value = await elements[i].evaluate((el) => el.getAttribute("href"));
//     appendToJSON("links.json", {
//       id: crypto.randomUUID(),
//       link: `${baseURL}${value}`,
//     });
//     console.log(value);
//   }
// })();

async function scrapData(websiteURL) {
  let data = {
    id: crypto.randomUUID(),
  };
  let keys = ["rating", "genre", "runtime", "age_rating"];
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(websiteURL);
  await page.waitForNetworkIdle();
  const imgSelector = await page.$(
    '.picture-comp.title-poster__image [type="image/jpeg"]'
  );
  const title = await page.$(".title-block div h1");
  const year = await page.$(".title-block div span");
  let elements = await page.$$(".detail-infos__value");
  for (let i = 0; i < keys.length; i++) {
    await wait(600);
    const value = await elements[i].evaluate((el) => el.textContent);
    data[keys[i]] = value;
  }
  let getImgSrc = await imgSelector.evaluate(
    (el) => el.getAttribute("data-srcset").split(",")[0]
  );
  let getTitle = await title.evaluate((el) => el.textContent);
  let getYear = await year.evaluate((el) => el.textContent);
  data["img_url"] = getImgSrc;
  data["title"] = getTitle;
  data["year"] = getYear;
  appendToJSON("disney_plus_content.json", data);
  console.log(data);
  await page.close();
}

async function scrapLinks() {
  for (let i = 3; i < linksJSON.length; i++) {
    await scrapData(linksJSON[i].link);
    await wait(2000);
  }
}
// scrapData("https://www.justwatch.com/us/tv-show/andor");
async function wait(duration) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}
// console.log(linksJSON[0].link);
scrapLinks();
