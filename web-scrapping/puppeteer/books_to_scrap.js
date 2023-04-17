const puppeteer = require("puppeteer");
const writeToJSON = require("../utils/appendJson");
const path = require("path");
const crypto = require("crypto");

const websiteURL = "http://books.toscrape.com/";

async function scrap() {
  const baseURL = "http://books.toscrape.com/";
  const data = [];
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();

  await page.goto(websiteURL);
  await page.waitForNetworkIdle();
  const articles = await page.$$(".product_pod");
  console.log(articles);
  for (let article of articles) {
    const id = crypto.randomUUID();
    const evalArticle = await article.evaluate((el) => {
      const baseURL = "http://books.toscrape.com/";
      const img = el.querySelector(".thumbnail").getAttribute("src");
      const title = el.querySelector("h3 a").title;
      const price = el.querySelector(".price_color").textContent;
      const link = el.querySelector(".image_container a").getAttribute("href");
      return {
        id: "",
        img: `${baseURL}${img}`,
        title,
        price,
        link: `${baseURL}${link}`,
      };
    });
    console.log(evalArticle);
    evalArticle.id = id;
    data.push(evalArticle);
    if (data) {
      await writeToJSON("books_to_scrap.json", data);
    }
    console.log("Scrapped successfully.");
  }
  await browser.close();
  process.exit();
}
scrap();
