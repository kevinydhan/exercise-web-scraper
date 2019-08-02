/**
 * Uses XMLHttpRequest and DOMParser to retrieve HTML documents.
 */
class WebScraper {
    constructor() {
        this.proxy = 'https://cors-anywhere.herokuapp.com/'
        this.parser = new DOMParser()
    }

    /**
     * Retrieves an HTML document and returns the document in a promise.
     *
     * @param {string} [options.method='GET'] - HTTP method
     * @param {string} options.url - Requested url to retrieve HTML from
     * @param {boolean} [option.proxy=true] - If true, `XMLHttpRequest` will use a proxy when attempting to retrieve the document
     *
     * @return {Promise} - Promise containing HTML document
     */
    scrape = ({ method = 'GET', url, proxy = true }) => {
        const parse = this.parse
        url = proxy ? this.proxy + url : url

        return new Promise((resolve, reject) => {
            const req = new XMLHttpRequest()
            req.open(method, url)
            req.send()

            req.onreadystatechange = () => {
                if (req.readyState === 4 && req.status === 200) {
                    const response = req.responseText
                    const html = parse({ document: response })

                    resolve(html)
                } else if (req.readyState === 4 && req.status !== 200) {
                    reject('Something went wrong')
                }
            }
        })
    }

    /**
     * Parses an XML/HTML document using DOMParser.
     *
     * @param {} options.html - XML/HTML document
     * @param {string} [options.mimeType='text/html'] - Requested MIME type for parsed document
     */
    parse = ({ document, mimeType = 'text/html' }) => {
        return this.parser.parseFromString(document, mimeType)
    }
}
