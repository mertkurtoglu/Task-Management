import '@/styles/globals.css';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Provider, useSelector } from 'react-redux';
import { store } from '@/store/store';
import Layout from '@/pages/components/Layout';
import Cookies from 'js-cookie';

const NO_LAYOUT_ROUTES = ['/login'];

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const isAuthenticated = !!Cookies.get("token");
  const isLoginPage = NO_LAYOUT_ROUTES.includes(router.pathname);

  useEffect(() => {
    if (!isAuthenticated && !isLoginPage) {
      router.push('/login');
    }
    if (isAuthenticated && isLoginPage) {
      router.push('/');
    }
  }, [isAuthenticated, isLoginPage, router]);

  const content = isLoginPage ? (
    <Component {...pageProps} />
  ) : (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );

  return (
    <Provider store={store}>
      {content}
    </Provider>);
}