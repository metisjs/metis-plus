import { useTranslation } from 'react-i18next';
import PageContainer from '@/components/PageContainer';

const Admin = () => {
  const { t } = useTranslation();

  return <PageContainer>{t('admin.access')}</PageContainer>;
};

export default Admin;
