const { deepStrictEqual } = require('assert')
const puppeteer = require('puppeteer')

// Runs a browser window with a given argv string and options:
let browser
async function parse (argv, opts) {
  if (!browser) {
    browser = await puppeteer.launch()
  }
  const page = await browser.newPage()
  opts = encodeURIComponent(JSON.stringify(opts))
  await page.goto(`http://127.0.0.1:8080/test/browser/yargs-test?argv=${encodeURIComponent(argv)}&opts=${opts}`)
  const element = await page.$('#output')
  return JSON.parse(await page.evaluate(element => element.textContent, element))
}

// The actual tests:
async function tests () {
  {
    const output = await parse('--hello world --x 102')
    deepStrictEqual(output, {
      _: [],
      hello: 'world',
      x: 102
    })
    console.info('✅ parse simple string')
  }

  {
    const output = await parse('--hello world --x 102', {
      alias: {
        hello: ['goodbye'],
        x: ['example']
      }
    })
    deepStrictEqual(output, {
      _: [],
      hello: 'world',
      x: 102,
      example: 102,
      goodbye: 'world'
    })
    console.info('✅ parse with aliases')
  }
}

tests().then(() => {
  console.info('👌all tests finished')
  browser.close()
}).catch((err) => {
  console.error(err.stack)
  console.error('❌some tests failed')
  process.exitCode = 1
  browser.close()
})
