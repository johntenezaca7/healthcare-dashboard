import * as React from 'react';
import { Link, type To } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

import { cn } from '@/styles/utils';

const BreadcrumbPrimitive = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<'nav'> & {
    separator?: React.ReactNode;
  }
>(({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />);
BreadcrumbPrimitive.displayName = 'Breadcrumb';

const BreadcrumbList = React.forwardRef<HTMLOListElement, React.ComponentPropsWithoutRef<'ol'>>(
  ({ className, ...props }, ref) => (
    <ol
      ref={ref}
      className={cn(
        'flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5',
        className
      )}
      {...props}
    />
  )
);
BreadcrumbList.displayName = 'BreadcrumbList';

const BreadcrumbItemPrimitive = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<'li'>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('inline-flex items-center gap-1.5', className)} {...props} />
));
BreadcrumbItemPrimitive.displayName = 'BreadcrumbItem';

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  React.ComponentPropsWithoutRef<'a'> & {
    asChild?: boolean;
    to?: string;
  }
>(({ className, to, ...props }, ref) => {
  if (to) {
    const { to: _, ...linkProps } = props as React.ComponentPropsWithoutRef<typeof Link> & {
      to?: string;
    };
    return (
      <Link
        ref={ref as React.ForwardedRef<HTMLAnchorElement>}
        to={to as To}
        className={cn('transition-colors hover:text-foreground', className)}
        {...linkProps}
      />
    );
  }
  return (
    <a
      ref={ref as React.ForwardedRef<HTMLAnchorElement>}
      className={cn('transition-colors hover:text-foreground', className)}
      {...props}
    />
  );
});
BreadcrumbLink.displayName = 'BreadcrumbLink';

const BreadcrumbPage = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<'span'>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn('font-normal text-foreground', className)}
      {...props}
    />
  )
);
BreadcrumbPage.displayName = 'BreadcrumbPage';

const BreadcrumbSeparator = ({ children, className, ...props }: React.ComponentProps<'li'>) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn('[&>svg]:size-3.5', className)}
    {...props}
  >
    {children ?? <ChevronRight />}
  </li>
);
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

const BreadcrumbEllipsis = ({ className, ...props }: React.ComponentProps<'span'>) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <ChevronRight className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
);
BreadcrumbEllipsis.displayName = 'BreadcrumbEllipsis';

// High-level Breadcrumb component for page navigation
export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

/**
 * Reusable breadcrumb component for page navigation
 * @example
 * <Breadcrumb items={[
 *   { label: 'Patient list', to: ROUTES.PATIENTS },
 *   { label: 'New Patient' }
 * ]} />
 */

export const Breadcrumb = ({ items }: BreadcrumbProps) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <BreadcrumbPrimitive>
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <React.Fragment key={index}>
              <BreadcrumbItemPrimitive>
                {isLast ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : item.to ? (
                  <BreadcrumbLink to={item.to}>{item.label}</BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                )}
              </BreadcrumbItemPrimitive>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </BreadcrumbPrimitive>
  );
};

// Export primitives for advanced usage
export {
  BreadcrumbEllipsis,
  BreadcrumbItemPrimitive,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbPrimitive,
  BreadcrumbSeparator,
};
