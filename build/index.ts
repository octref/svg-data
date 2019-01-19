import { getSVGSpec } from './svg-spec'
import { getMDNMDDescription } from './mdn-description'

import { toCompatString, sleep } from './util';
import * as path from 'path'
import * as fs from 'fs'
import { addMDNData } from './mdn-data';

const bcd = require('mdn-browser-compat-data')
const mdnData = require('mdn-data')

;(async () => {
  const { elements, globalAttributes, cssProperties } = getSVGSpec()
  
  cssProperties.forEach(p => {
    addMDNData(p)
  })
  
  for (let p of cssProperties) {
    const desc = await getMDNMDDescription(p.name, 'attribute')
    if (desc) {
      p.description = desc
      await sleep(500)
    }
    console.log(`Done with ${p.name}`)
  }

  // const elementPromises = elements.map(el => {
  //   return new Promise(resolve => {
  //     getMDNMDDescription(el.name, 'tag').then(d => {
  //       el.description = d
  //       resolve()
  //     })
  //   })
  // })

  // await Promise.all(elementPromises)
  
  // const allAttributes = globalAttributes
  // elements.forEach(el => {
  //   el.attributes.forEach(a => {
  //     if (!allAttributes.find(ta => ta.name === a.name)) {
  //       allAttributes.push(a)
  //     }
  //   })
  // })

  // const attributePromises = allAttributes.map(a => {
  //   return new Promise(resolve => {
  //     getMDNMDDescription(a.name, 'attribute').then(d => {
  //       a.description = d
  //       resolve()
  //     })
  //   })
  // })

  // await Promise.all(attributePromises)

  // const htmlOut = {
  //   tags: elements,
  //   globalAttributes
  // }

  // fs.writeFileSync(path.resolve(__dirname, '../data/svg-html-contribution.json'), JSON.stringify(htmlOut, null, 2))

  const cssOut = {
    properties: cssProperties
  }

  fs.writeFileSync(path.resolve(__dirname, '../data/svg-css-contribution.json'), JSON.stringify(cssOut, null, 2))
})()