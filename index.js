const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
app.use(express.json({ limit: '10mb' }));

app.post('/generate-pdf', async (req, res) => {
  // if (req.headers['x-api-key'] !== process.env.API_KEY) {
  //   return res.status(401).send('Unauthorized');
  // }

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setContent(req.body.html, { waitUntil: 'networkidle0' });
  const pdf = await page.pdf({ format: 'A4', margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' } });
  await browser.close();

  res.set('Content-Type', 'application/pdf');
  res.send(pdf);
});

app.listen(process.env.PORT || 3000);
