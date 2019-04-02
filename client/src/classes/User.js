import convert from 'xml-js'

export default class User {
  constructor(data) {
    const parsed = convert.xml2json(data, { compact: true, spaces: 2 })
    const { name, subscriber, key } = JSON.parse(parsed).lfm.session
    this.name = name._text
    this.subscriber = parseInt(subscriber._text)
    this.key = key._text
  }
}
