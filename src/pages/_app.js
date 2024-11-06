import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <div className="app-wrapper">
      <Component {...pageProps} />
    </div>
  );
}
