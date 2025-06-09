import LoginForm from './Form';
import BannerImg from '@/assets/banner.svg?react';
import Logo from '@/assets/logo.svg?react';
import Footer from '@/components/Footer';

const Login = () => (
  <div className="flex h-screen">
    <div className="fixed top-6 left-5.5 z-1 inline-flex items-center gap-2">
      <Logo className="h-8 w-8" />
      <div className="mx-1 text-xl text-indigo-100">Metis Plus</div>
    </div>
    <div className="flex w-140 items-center justify-center bg-linear-164 from-indigo-950 to-indigo-500">
      <div className="flex h-full flex-1 items-center justify-center">
        <BannerImg className="w-full" />
      </div>
    </div>
    <div className="relative flex flex-1 items-center justify-center px-10 pb-10">
      <LoginForm />
      <Footer className="absolute right-0 bottom-0 w-full" />
    </div>
  </div>
);

export default Login;
