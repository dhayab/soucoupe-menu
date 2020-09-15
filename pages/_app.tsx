import './_app.scss';

import { AppProps } from 'next/app';

const App = ({ Component, pageProps }: AppProps) => <Component {...pageProps} />;
export default App;
