import React from 'react';
import { Button, Result } from 'metis-ui';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

const NoFoundPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Result
      status="403"
      title="403"
      subTitle={t('pages.403.subTitle')}
      extra={
        <Button type="primary" onClick={() => navigate('/')}>
          {t('pages.403.buttonText')}
        </Button>
      }
    />
  );
};

export default NoFoundPage;
