import LoginForm from './Form';
import BannerImg from '@/assets/banner.svg?react';
import Logo from '@/assets/logo.svg?react';
import Footer from '@/components/Footer';

const Login = () => (
  <div className="flex h-screen dark:bg-gray-900">
    <div className="fixed top-6 left-6 z-1 inline-flex items-center gap-2">
      <Logo className="size-8" />
      <div className="text-xl">Metis Plus</div>
    </div>
    <div className="relative flex flex-1 items-center justify-center px-10 pb-10">
      <LoginForm />
      <Footer className="absolute right-0 bottom-0 w-full" />
    </div>
    <div className="flex w-145 items-center justify-center bg-linear-164 from-indigo-900 to-indigo-500 dark:to-indigo-700">
      <div className="flex h-full flex-1 items-center justify-center">
        <BannerImg className="w-full" />
      </div>
    </div>
  </div>
);

export default Login;
