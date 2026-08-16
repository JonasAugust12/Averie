'use client';

import Link from 'next/link';
import type { AnchorHTMLAttributes, ReactNode } from 'react';

function isExternalHref(href: string): boolean {
    return /^(https?:|mailto:|tel:|sms:|ftp:)/i.test(href);
}

type AppLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    children: ReactNode;
};

export function AppLink({ href, children, className, target, rel, ...rest }: AppLinkProps) {
    if (isExternalHref(href)) {
        const isHttp = /^https?:/i.test(href);
        return (
            <a
                href={href}
                className={className}
                target={target ?? (isHttp ? '_blank' : undefined)}
                rel={rel ?? (isHttp ? 'noopener noreferrer' : undefined)}
                {...rest}
            >
                {children}
            </a>
        );
    }

    return (
        <Link href={href} className={className} {...rest}>
            {children}
        </Link>
    );
}
