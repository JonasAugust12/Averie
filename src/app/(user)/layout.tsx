/**
 * User-facing route group. Pages stay as Server Components for SEO metadata;
 * interactive UI lives in client views under @components/*.
 * Admin remains separately under /admin (client-heavy, no SEO need).
 */
export default function UserLayout({ children }: { children: React.ReactNode }) {
    return children;
}
