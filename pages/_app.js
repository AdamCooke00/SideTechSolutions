// import 'semantic-ui-css/semantic.min.css'
import '../styles/globals.css'
import '../styles/design_tokens.css'
import '../styles/index.scss'
import { AuthProvider } from '../context/AuthContext'

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )
}

export default MyApp
