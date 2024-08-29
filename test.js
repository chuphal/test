const fs = require("fs").promises;
const fsExtra = require("fs-extra")
const path = require("path");
const { Actor } = require("apify");
const { PlaywrightCrawler } = require("crawlee");

Actor.main(async () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    console.log(currentYear);

    const crawler = new PlaywrightCrawler({
        // headless: false,
        requestHandlerTimeoutSecs: 240,

        async requestHandler({ request, page, log }) {

            //   log.info(`Processing ${request.url} for year`);
            //   const Yearlinks = [];
            //   const isLinksTillLastYearExist = fsExtra.existsSync("./linksTillLastYear.json");
            //   let getLatestDataDate;
            //   if (isLinksTillLastYearExist) {
            //     getLatestDataDate = JSON.parse(fsExtra.readFileSync("./linksTillLastYear.json"));
            //   }

            

            console.log(currentMonthLinksWithDate)


            //       for (let year = currentYear; year >= isLinksTillLastYear ? currentYear : 1991; year--) {

            //         await page.goto(
            //           "https://www.rbi.org.in/Scripts/NotificationUser.aspx"
            //         );

            //         // await page.waitForLoadState("networkidle");

            //         if (year < 2015) {
            //           await page.getByText("Archives").click();
            //           await page.waitForTimeout(2000);
            //         }
            //         await page.locator(`#btn${year}`).click();
            //         await page.locator(`//*[@id="${year}0"]`).click();
            //         await page.waitForTimeout(2000);

            //         const links = await page.$$eval("a.link2", (elements) => {
            //           console.log({ elements })
            //           return elements.map((element) => `https://rbi.org.in/Scripts/` + element.getAttribute("href"),
            //           );
            //         });

            //         Yearlinks.push(...links);
            //       }

            //       const fileName = isLinksTillLastYear ? "linksCurrentYear" : "linksTillLastYear.json";
            //       const folderName = "src";
            //       const folderPath = path.join(process.cwd(), folderName);
            //       const filePath = path.join(folderPath, fileName);

            //       // Create the folder if it doesn't exist
            //       await fs.mkdir(folderPath, { recursive: true });

            //       await fs.writeFile(filePath, JSON.stringify(Yearlinks, null, 2));
            //       console.log(`Links saved to ${filePath}`);
        },
    });

    await crawler.run(["https://rbi.org.in/Scripts/NotificationUser.aspx"]);

});
