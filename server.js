const path = require('path');
const express = require('express');
const puppeteer = require('puppeteer');

const app = express();

app.use(express.json({
    limit: '50mb'
}));

// Global browser instance
let browser = null;

// Launch browser only once
async function getBrowser() {

    if (browser && browser.connected) {
        return browser;
    }

    browser = await puppeteer.launch({
        executablePath: path.join(
            process.cwd(),
            'chrome',
            'chrome',
            'linux-151.0.7922.47',
            'chrome-linux64',
            'chrome'
        ),
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    });

    console.log('Chrome launched');

    return browser;
}

app.post('/pdf', async (req, res) => {

    let page;

    try {

        const browser = await getBrowser();

        page = await browser.newPage();
        console.log('1. New page created');
        
        await page.setCacheEnabled(true);

        // await page.setContent(req.body.html, {
        //     waitUntil: 'networkidle0'
        // });
        await page.goto(req.body.url, {
            waitUntil: 'networkidle0'
        });
        console.log('2. HTML loaded');

        const pdf = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '5mm',
                right: '5mm',
                bottom: '5mm',
                left: '5mm'
            }
        });
        console.log('3. PDF created');

        await page.close();
        console.log('4. Page closed');

        res.set({
            'Content-Type': 'application/pdf'
        });

        res.send(pdf);
        console.log('5. PDF Send');
    } catch (e) {

        console.log(e);

        if (page) {
            await page.close().catch(() => {});
        }

        res.status(500).send(e.toString());
    }

});

app.listen(process.env.PORT || 3000, async () => {

    console.log('Server started');

    await getBrowser();

});
