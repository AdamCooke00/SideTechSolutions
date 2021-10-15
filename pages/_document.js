import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="description" content="A platform to assist students and landlords find each other. Trialing in Kingston Ontario, Student Housing Hub aims to
        assist Queen's University Students find housing rental accomodations by offering a simpler alternative. Includes house filtering functionality."></meta>
        <meta httpEquiv="Content-Type" content="text/html" charSet="utf-8" />
        <meta name="viewport" content="width=device-width" initial-scale="1" />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument