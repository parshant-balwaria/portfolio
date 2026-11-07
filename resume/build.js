// Renders resume/resume.html to a PDF with headless Chromium.
// Usage: node resume/build.js [output.pdf]   (default: Parshant_Resume.pdf in the repo root)
const path = require('path');
const { chromium } = require('playwright');

(async () => {
    const src = path.join(__dirname, 'resume.html');
    const out = path.resolve(process.argv[2] || path.join(__dirname, '..', 'Parshant_Resume.pdf'));
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('file://' + src);
    await page.pdf({ path: out, format: 'A4', preferCSSPageSize: true, printBackground: true });
    await browser.close();
    console.log('Wrote ' + out);
})();
