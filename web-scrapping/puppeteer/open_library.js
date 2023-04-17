const puppeteer = require("puppeteer");
const writeToJSON = require("../utils/appendJson");
const path = require("path");
const crypto = require("crypto");

const websiteURL = "https://openlibrary.org/trending/now?page=1";

async function scrap() {
  const data = [];
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();

  await page.goto(websiteURL);
  await page.waitForNetworkIdle();

  const allElement = await page.$$(".searchResultItem");
  for (let element of allElement) {
    const evaluatedElement = await element.evaluate((el) => {
      const id = crypto.randomUUID();
      const title = el.querySelector(".results").textContent;
      const author = el.querySelector(".bookauthor .results").textContent;
      const img = el.querySelector("span.bookcover img").getAttribute("src");
      return {
        id,
        title,
        author,
        img: `https:${img}`,
      };
    });
    data.push(evaluatedElement);
  }
  if (data) {
    await writeToJSON("OpenLibrary.json", data);
  }
  await browser.close();
}
