import { clsx, Layout } from 'metis-ui';

interface FooterProps {
  className?: string;
}

function Footer(props: FooterProps = {}) {
  const { className } = props;
  return (
    <Layout.Footer
      className={clsx(
        'text-text-quaternary flex h-10 items-center justify-center text-sm',
        className,
      )}
    >
      Metis Plus ©2025 Created by Metis Team
    </Layout.Footer>
  );
}

export default Footer;
