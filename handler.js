const chromium = require('chrome-aws-lambda');
const fs = require('fs');

module.exports.createPdf = async(event) => {
    try 
    {
        browser = await chromium.puppeteer.launch(
            {
                args: chromium.args,
                defaultViewport: chromium.defaultViewport,
                executablePath: await chromium.executablePath,
                headless: chromium.headless,
                ignoreHTTPSErrors: true,
            }
        );

        const page = await browser.newPage();

        await page.setContent(event.html, {
            waitUntil: 'domcontentloaded'
        });

        // create a pdf buffer
        const pdfBuffer = await page.pdf({
            format: 'A4'
        });

        const filePath =`./tmp/${event.formName}.pdf`;

        // or a .pdf file
        await page.pdf({
            format: 'A4',
            path: filePath
        });

        // close the browser
        await browser.close();

        return {
            statusCode: 200,
            body: fs.readFileSync(filePath, {encoding: 'utf-8'}),
            headers: {
                'Content-Type': 'application/pdf'
            }
        };

    } catch(error){
        throw error;
    } finally{
        if (browser !== null) {
            await browser.close();
        }
    }
};