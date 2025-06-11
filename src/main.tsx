import { StrictMode, useEffect } from 'react';
import { useLocalStorageState } from 'ahooks';
import { ConfigProvider } from 'metis-ui';
import type { Locale } from 'metis-ui/es/locale';
import enUS from 'metis-ui/es/locale/en_US';
import zhCN from 'metis-ui/es/locale/zh_CN';
import { createRoot } from 'react-dom/client';
import { useTranslation } from 'react-i18next';
import { RouterProvider } from 'react-router';
import Loading from './loading';
import './locale';
import { loginPath, router } from './routes';
import { useUserStore } from './store/user';

const METIS_UI_LOCALE: Record<string, Locale> = {
  'en-US': enUS,
  'zh-CN': zhCN,
};

function App() {
  const { i18n } = useTranslation();
  const fetchCurrentUser = useUserStore((state) => state.fetchCurrentUser);
  const loading = useUserStore((state) => state.loading);
  const [theme] = useLocalStorageState('theme', {
    defaultValue: 'system',
    listenStorageChange: true,
  });

  useEffect(() => {
    if (window.location.pathname !== loginPath) {
      fetchCurrentUser();
    }
  }, []);

  return (
    <ConfigProvider locale={METIS_UI_LOCALE[i18n.language]} theme={theme}>
      {loading ? <Loading /> : <RouterProvider router={router} />}
    </ConfigProvider>
  );
}

(async () => {
  if (
    (import.meta.env.DEV && import.meta.env.VITE_ENABLE_MOCK === 'true') ||
    import.meta.env.VITE_GH_PAGES
  ) {
    const { worker } = await import('./mocks/browser');
    await worker.start({});
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
})();
