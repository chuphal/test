const { Actor, Dataset, RequestQueue } = require("apify");
const { PlaywrightCrawler } = require("crawlee");
const PdfParse = require("pdf-parse");
const { getLinks } = require("./get");

async function extractText(page) {
    let Date = "null";
    let Title = "null";
    try {
        Date = await page.$eval(
            "tr.tablecontent2 td p[align='right']",
            (element) => element.textContent.trim()
        );
    } catch (error) {
        console.error("Date not found:", error.message);
    }

    try {
        Title = await page.$eval("td.tableheader b", (element) =>
            element.textContent.trim()
        );
    } catch (error) {
        console.error("Title not found:", error.message);
    }

    // Main content
    let mainContent = await page.$$eval("td p", (paragraphs) =>
        paragraphs.map((paragraph) => paragraph.textContent.trim())
    );

    // Table data
    let tableData = await page.$$eval("table tbody .tablebg tr", (rows) =>
        rows.map((row) => row.textContent.trim())
    );

    // PDF links
    // let pdfLinks = await page.$$eval("a", (links) =>
    //     links
    //         .filter((link) => link.href.toLowerCase().endsWith(".pdf"))
    //         .map((link) => link.href)
    // );

    let pdfLinks = await page.$$eval("a", (links) =>
        links
            .filter(
                (link) =>
                    link.href.toLowerCase().endsWith(".pdf") &&
                    !link.href.toLowerCase().endsWith("utkarsh30122022.pdf")
            )
            .map((link) => link.href)
    );

    // let pdfLink = await page.$eval('td.tableheader a[href$=".PDF"]', link => link.href);
    // let pdfLinks = [pdfLink];

    // Fetch and parse PDFs
    const { default: fetch } = await import("node-fetch");
    const pdfPromises = pdfLinks.map(async (pdfLink) => {
        try {
            const response = await fetch(pdfLink);
            const buffer = await response.arrayBuffer();

            // Parse the entire PDF
            const pdfData = await PdfParse(buffer);
            const numPages = pdfData.numpages;
            const pagesText = pdfData.text.split("\n\n"); // Assuming \f (form feed) separates pages

            // Prepare the array to hold text with page numbers
            const pdfTextWithPages = [];
            for (let i = 1; i <= numPages; i++) {
                pdfTextWithPages.push({ pageNumber: i, text: pagesText[i] });
            }

            return {
                linkText: "null",
                link: pdfLink,
                Docket: "null",
                Date: Date,
                Category: "RBI",
                Doc_Type: "PDF",
                Title: Title,
                Page_Number: numPages,
                Page_Content: pdfTextWithPages,
            };
        } catch (error) {
            console.error(`Error processing PDF ${pdfLink}:`, error.message);
            return {
                linkText: "null",
                link: pdfLink,
                Docket: "null",
                Date: "null",
                Category: "null",
                Doc_Type: "PDF",
                Title: "null",
                Page_Number: "null",
                Page_Content: "null",
            };
        }
    });

    let PdfData = await Promise.all(pdfPromises);
    if (PdfData.length == 0) {
        PdfData = [
            {
                linkText: "null",
                link: "null",
                Docket: "null",
                Date: "null",
                Category: "null",
                Doc_Type: "PDF",
                Title: "null",
                Page_Number: "null",
                Page_Content: "null",
            },
        ];
    }

    const data = {
        Docket: "null",
        Date: Date,
        Category: "Reserve Bank of India",
        Doc_Type: "Web Page",
        Title: Title,
        Page_Number: "1",
        Page_Content: {
            mainContent,
            tableData,
        },
        Links: [
            {
                linkText: "null",
                link: "null",
                Category: "null",
                InnerText: "null",
                Inner_Links: "null",
                Inner_PDFs_Links: "null",
                PdfDataArray: "null",
            },
        ],
        PDFs: PdfData,
    };

    return data;
}

Actor.main(async () => {
    const initialArrayOfObjects = await getLinks();
    console.log({initialArrayOfObjects});

    const crawler = new PlaywrightCrawler({
        async requestHandler({ request, page, log, enqueueLinks }) {
            try {
                log.info(`Processing ${request.url}`);
                const extractedData = await extractText(page);
                console.log({ extractedData })
                const DataSetError = await Dataset.open(`RBI2`);
                await DataSetError.pushData({
                    URL: request.url,
                    ...extractedData,
                });
            } catch (error) {
                log.error(`Error processing ${request.url}:`, error.message);
                const DataSetError = await Dataset.open(`RBI2Error`);
                await DataSetError.pushData({
                    URL: request.url,
                    Docket: "null",
                    Date: "null",
                    Category: "Reserve Bank of India",
                    Doc_Type: "Web Page",
                    Title: "null",
                    Page_Number: "1",
                    Page_Content: error.message,
                    Links: [
                        {
                            linkText: "null",
                            link: "null",
                            Category: "null",
                            InnerText: "null",
                            Inner_Links: "null",
                            Inner_PDFs_Links: "null",
                            PdfDataArray: "null",
                        },
                    ],
                    PDFs: [
                        {
                            linkText: "null",
                            link: "null",
                            Docket: "null",
                            Date: "null",
                            Category: "null",
                            Doc_Type: "PDF",
                            Title: "null",
                            Page_Number: "null",
                            Page_Content: "null",
                        },
                    ],
                });
            }
        },
    });

    await crawler.addRequests(initialArrayOfObjects);

    await crawler.run();
});
