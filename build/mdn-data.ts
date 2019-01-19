import * as mdnData from 'mdn-data'
const bcdData = require('mdn-browser-compat-data')

import { CSSProperty } from './svg-spec';
import { toCompatString, isSupportedInAllBrowsers } from './util';

const properties = mdnData.css.properties
const bcdProperties = bcdData.css.properties

export function addMDNData(property: Partial<CSSProperty>) {
  if (getPropertyStatus(property.name)) {
    property.status = getPropertyStatus(property.name)
  }
  if (getPropertySyntax(property.name)) {
    property.status = getPropertySyntax(property.name)
  }
  if (getPropertyBrowsers(property.name)) {
    property.browsers = getPropertyBrowsers(property.name)
  }
}

function getPropertyStatus(name: string) {
  if (properties[name]) {
    return properties[name].status
  }
}

function getPropertySyntax(name: string) {
  if (properties[name]) {
    return properties[name].syntax
  }
}

function getPropertyBrowsers(name: string) {
  if (bcdProperties[name]) {
    if (!isSupportedInAllBrowsers(bcdProperties[name])) {
      return toCompatString(bcdProperties[name])
    }
  }
}