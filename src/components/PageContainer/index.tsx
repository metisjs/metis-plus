import { use, type FC, type PropsWithChildren, type ReactNode } from 'react';
import { HomeOutline } from '@metisjs/icons';
import { Breadcrumb, clsx, type BreadcrumbProps, type SemanticClassName } from 'metis-ui';
import useSemanticCls from 'metis-ui/es/_util/hooks/useSemanticCls';
import { Link } from 'react-router';
import MenuContext from '@/layouts/MainLayout/MenuConext';

export interface PageContainerProps {
  title?: ReactNode;
  className?: SemanticClassName<{ header?: string; content?: string }>;
  ghost?: boolean;
}

const PageContainer: FC<PropsWithChildren<PageContainerProps>> = ({
  title,
  children,
  ghost,
  className,
}) => {
  const { matchedMenus, breadcrumbs } = use(MenuContext);

  const semanticCls = useSemanticCls(className);

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
    <div className={semanticCls.root}>
      <div
        className={clsx(
          'mb-6 flex flex-wrap items-center justify-between gap-3',
          semanticCls.header,
        )}
      >
        <h2 className="text-text text-xl font-semibold">{title ?? currentMenu?.label}</h2>
        <Breadcrumb items={mergedBreadcrumbs} itemRender={itemRender} />
      </div>

      {ghost ? (
        <div className={semanticCls.content}>{children}</div>
      ) : (
        <div
          className={clsx(
            'rounded-2xl border border-gray-950/5 bg-white p-5 lg:p-6 dark:border-white/10 dark:bg-white/3',
            semanticCls.content,
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default PageContainer;
