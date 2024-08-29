const fs = require("fs").promises;
const path = require("path");
const { Actor } = require("apify");
const { PlaywrightCrawler } = require("crawlee");
const { default: fsExtra } = require("fs-extra");

Actor.main(async () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentDate = new Date();
  console.log(currentYear);

  const crawler = new PlaywrightCrawler({
    // headless: false,
    requestHandlerTimeoutSecs: 240,

    async requestHandler({ request, page, log }) {

      log.info(`Processing ${request.url} for year`);
      let currentMonthLinksWithDate = [];

      const isDataFileExist = fsExtra.existsSync("./data.json");
      if (isDataFileExist) {
        const latestPostDate = JSON.parse(fsExtra.readFileSync("./data.json"))[0].date;


        for (let date = currentDate; date <= latestPostDate; date.setDate(date.getDate() + 1)) {
          const element = array[i];
          const year = date.getFullYear();
          const month = date.toLocaleString('en-US', { month: 'short' });
          const day = date.getDate();

          
        }

        const linksAndDatesArr = await page.$$eval("a.link2", (elements) => {
          return elements.map((element) => element.tagName === "TD" ? element.innerText : `https://rbi.org.in/Scripts/` + element.getAttribute("href")
          );
        });


      }

      for (let year = currentYear; year >= 2024; year--) {

        await page.goto(
          "https://www.rbi.org.in/Scripts/NotificationUser.aspx"
        );

        // await page.waitForLoadState("networkidle");

        if (year < 2015) {
          await page.getByText("Archives").click();
          await page.waitForTimeout(2000);
        }
        await page.locator(`#btn${year}`).click();
        await page.locator(`//*[@id="${year}0"]`).click();

        await page.waitForTimeout(2000);


        const linksAndDatesArr = await page.$$eval("a.link2, td.tableheader", (elements) => {
          return elements.map((element) => element.tagName === "TD" ? element.innerText : `https://rbi.org.in/Scripts/` + element.getAttribute("href")
          );
        });
        const linksAndDatesLength = linksAndDatesArr.length;
        let obj = {};

        for (let i = 0; i < linksAndDatesLength; i++) {
          const element = linksAndDatesArr[i];
          const validateData = new Date(element);
          if (!isNaN(validateData.getTime())) {
            if (Object.keys(obj).length !== 0) {
              currentMonthLinksWithDate.push(obj);
            }
            obj = {};
            obj.links = [];
            obj.date = element;
            continue;
          }
          obj.links.push(element);
        }

      }

      const fileName = "linkscurrentyear.json";
      const folderName = "src";
      const folderPath = path.join(process.cwd(), folderName);
      const filePath = path.join(folderPath, fileName);

      // Create the folder if it doesn't exist
      await fs.mkdir(folderPath, { recursive: true });

      await fs.writeFile(filePath, JSON.stringify(currentMonthLinksWithDate, null, 2));
      console.log(`Links saved to ${filePath}`);
    },
  });

  await crawler.run(["https://rbi.org.in/Scripts/NotificationUser.aspx"]);

});
