import { getSVGSpec } from './svg-spec'
import { getMDNMDDescription } from './mdn-description'

import { toCompatString, sleep } from './util'
import * as path from 'path'
import * as fs from 'fs'
import { addMDNData } from './mdn-data'

const bcd = require('mdn-browser-compat-data')
const mdnData = require('mdn-data')

async function getCSSData() {
  const { cssProperties } = getSVGSpec()

  cssProperties.forEach(p => {
    addMDNData(p)
  })

  for (let p of cssProperties) {
    const desc = await getMDNMDDescription(p.name, 'attribute')
    if (desc) {
      p.description = desc
      await sleep(1000)
    }
    console.log(`Done with ${p.name} property`)
  }

  const cssOut = {
    properties: cssProperties
  }

  console.log('Writing svg-css-contribution.json')
  fs.writeFileSync(path.resolve(__dirname, '../data/svg-css-contribution.json'), JSON.stringify(cssOut, null, 2))
  console.log('Written svg-css-contribution.json')
}

async function getHTMLData() {
  const { elements, globalAttributes } = getSVGSpec()

  for (let e of elements) {
    const desc = await getMDNMDDescription(e.name, 'tag')
    if (desc) {
      e.description = desc
      await sleep(1000)
      console.log(`Done with ${e.name} tag`)
    }
  }

  const allAttributes = globalAttributes
  elements.forEach(el => {
    el.attributes.forEach(a => {
      if (!allAttributes.find(ta => ta.name === a.name)) {
        allAttributes.push(a)
      }
    })
  })

  for (let a of allAttributes) {
    const desc = await getMDNMDDescription(a.name, 'attribute')
    if (desc) {
      a.description = desc
      await sleep(1000)
      console.log(`Done with ${a.name} attribute`)
    }
  }

  const htmlOut = {
    tags: elements,
    globalAttributes
  }

  fs.writeFileSync(path.resolve(__dirname, '../data/svg-html-contribution.json'), JSON.stringify(htmlOut, null, 2))
}

;(async () => {
  await getHTMLData()
})()
