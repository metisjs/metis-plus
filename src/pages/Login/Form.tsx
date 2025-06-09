import { useEffect, useRef, useState } from 'react';
import { LockClosedOutline, UserOutline } from '@metisjs/icons';
import { useLocalStorageState } from 'ahooks';
import { Button, Checkbox, Form, Input, Space, type FormInstance } from 'metis-ui';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { login } from '@/apis/user';
import useRequest from '@/hooks/useRequest';
import { setToken } from '@/utils/request';

type LoginValues = { username: string; password: string };

export default function LoginForm() {
  const formRef = useRef<FormInstance<LoginValues>>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState('');
  const [loginParams, setLoginParams] = useLocalStorageState<LoginValues | undefined>(
    'loginParams',
  );
  const [rememberPwd, setRememberPwd] = useState(!!loginParams);

  const { runAsync: runLogin, loading } = useRequest(login, { manual: true });

  useEffect(() => {
    if (formRef.current && rememberPwd && loginParams) {
      formRef.current.setFieldsValue(loginParams);
    }
  }, []);

  const handleSubmit = async (value: LoginValues) => {
    try {
      const { token } = await runLogin(value.username, value.password);
      setToken(token);
      navigate('/');
      setLoginParams(rememberPwd ? value : undefined);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(t(error.message));
      } else {
        setErrorMessage(String(error));
      }
    }
  };

  return (
    <div className="w-80 text-sm">
      <div className="text-2xl/8 font-medium">{t('login.form.title')}</div>
      <div className="text-text-tertiary text-base/6">{t('login.form.subTitle')}</div>
      <div className="text-error h-8 leading-8">{errorMessage}</div>
      <Form ref={formRef} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="username"
          rules={[{ required: true, message: t('login.form.required.username') }]}
        >
          <Input prefix={<UserOutline />} placeholder={t('login.form.username.placeholder')} />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: t('login.form.required.password') }]}
        >
          <Input.Password
            prefix={<LockClosedOutline />}
            placeholder={t('login.form.password.placeholder')}
          />
        </Form.Item>
        <Space size={16} vertical block justify="center">
          <div className="flex justify-between">
            <Checkbox checked={rememberPwd} onChange={setRememberPwd}>
              {t('login.form.rememberPassword')}
            </Checkbox>
            <Link to="/login">{t('login.form.forgetPassword')}</Link>
          </div>
          <Button type="primary" htmlType="submit" loading={loading} className="w-full">
            {t('login.form.login')}
          </Button>
          <Button type="text" className="text-text-tertiary w-full font-normal">
            {t('login.form.register')}
          </Button>
        </Space>
      </Form>
    </div>
  );
}
