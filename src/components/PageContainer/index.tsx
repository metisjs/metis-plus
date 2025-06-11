import { use, type FC, type PropsWithChildren, type ReactNode } from 'react';
import { HomeOutline } from '@metisjs/icons';
import { Breadcrumb, type BreadcrumbProps } from 'metis-ui';
import { Link } from 'react-router';
import MenuContext from '@/layouts/MainLayout/MenuConext';

export interface PageContainerProps {
  title?: ReactNode;
}

const PageContainer: FC<PropsWithChildren<PageContainerProps>> = ({ title, children }) => {
  const { matchedMenus, breadcrumbs } = use(MenuContext);

  const itemRender: BreadcrumbProps['itemRender'] = (item, _, __, ___, isLast) =>
    isLast ? (
      <span>{item.title}</span>
    ) : (
      <Link to={`${item.key}`} className="text-text-tertiary">
        {item.title ?? item.icon}
      </Link>
    );

  const currentMenu = matchedMenus[matchedMenus.length - 1];
  const mergedBreadcrumbs = [
    { key: '/', icon: <HomeOutline className="size-4.5" /> },
    ...breadcrumbs,
  ];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90" x-text="pageName">
          {title ?? currentMenu?.label}
        </h2>
        <Breadcrumb items={mergedBreadcrumbs} itemRender={itemRender} />
      </div>
      <div className="rounded-2xl border border-gray-950/5 bg-white p-5 lg:p-6 dark:border-white/10 dark:bg-white/[0.03]">
        {children}
      </div>
    </div>
  );
};

export default PageContainer;
