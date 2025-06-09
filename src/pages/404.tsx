import React from 'react';
import { Button, Result } from 'metis-ui';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

const NoFoundPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Result
      status="404"
      title="404"
      subTitle={t('pages.404.subTitle')}
      extra={
        <Button type="primary" onClick={() => navigate('/')}>
          {t('pages.404.buttonText')}
        </Button>
      }
    />
  );
};

export default NoFoundPage;
