import Head from 'next/head'
import './styles/global.css'

// This default export is required in a new `pages/_app.js` file.
export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
