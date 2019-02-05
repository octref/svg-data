import * as path from 'path'
import * as fs from 'fs'

const DEFINITION_PATH = path.resolve(__dirname, '../node_modules/svgwg/master/definitions.xml')

import * as cheerio from 'cheerio'

export interface HTMLElement {
  name: string
  spec: string
  description?: string
  attributes: HTMLAttribute[]
  attributeCategories: string[]
}

export interface HTMLAttribute {
  name: string
  spec: string
  description?: string
}

interface HTMLAttributeCategory {
  name: string
  spec: string
  attributes: HTMLAttribute[]
}

export interface CSSProperty {
  name: string
  spec: string
  description?: string
  browsers?: string[]
  status?: string
  syntax?: string
  values?: CSSPropertyValue[]
}

export interface CSSSpecProperty {
  name: string
  spec: string
}

export interface CSSPropertyValue {
  name: string
  spec: string
  descriptipn: string
}

const globalAttributes: HTMLAttribute[] = []
const attributeCategories: HTMLAttributeCategory[] = []
const elements: HTMLElement[] = []
const cssSpecProperties: CSSSpecProperty[] = []

function handleHref(href: string) {
  return href.startsWith('https://') ? href : 'https://www.w3.org/TR/SVG/' + href
}

function parseStringList(str: string) {
  return str.split(',').map(s => s.trim())
}

export function getSVGSpec() {
  const src = fs.readFileSync(DEFINITION_PATH, 'utf-8')
  const $ = cheerio.load(src, {
    xmlMode: true
  })

  $('definitions > attribute').each((_, e) => {
    globalAttributes.push({
      name: e.attribs['name'],
      spec: handleHref(e.attribs['href'])
    })
  })

  $('attributecategory').each((_, e) => {
    const attrCate = {
      name: e.attribs['name'],
      spec: handleHref(e.attribs['href']),
      attributes: []
    }

    $(e)
      .find('attribute')
      .each((_, e) => {
        attrCate.attributes.push({
          name: e.attribs['name'],
          spec: handleHref(e.attribs['href'])
        })
      })

    attributeCategories.push(attrCate)
  })

  $('element').each((_, e) => {
    const el = {
      name: e.attribs['name'],
      spec: handleHref(e.attribs['href']),
      attributes: [],
      attributeCategories: []
    }

    if (e.attribs['attributes']) {
      parseStringList(e.attribs['attributes']).forEach(s => {
        const matchingAttr = globalAttributes.find(a => a.name === s)
        if (matchingAttr) {
          el.attributes.push(matchingAttr)
        }
      })
    }

    $(e)
      .find('attribute')
      .each((_, ea) => {
        el.attributes.push({
          name: ea.attribs['name'],
          href: handleHref(ea.attribs['href'])
        })
      })

    if (e.attribs['attributecategories']) {
      parseStringList(e.attribs['attributecategories']).forEach(s => {
        el.attributeCategories.push(s)
      })
    }

    elements.push(el)
  })

  $('property').each((_, e) => {
    cssSpecProperties.push({
      name: e.attribs['name'],
      spec: handleHref(e.attribs['href'])
    })
  })

  return {
    elements,
    globalAttributes,
    cssSpecProperties
  }
}