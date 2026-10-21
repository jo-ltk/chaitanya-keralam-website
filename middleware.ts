import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const PUBLIC_AUTH_PATHS = [
  '/admin/login',
  '/admin/forgot-password',
  '/admin/reset-password',
  '/admin/invite',
  '/admin/invite/expired',
  '/admin/verify-email',
  '/admin/session-expired',
  '/admin/signed-out',
  '/admin/access-denied',
  '/admin/locked',
  '/admin/error'
];

const MFA_PATHS = [
  '/admin/two-factor',
  '/admin/two-factor/setup'
];

function isAllowed(view: string, role: string): boolean {
  const A: Record<string, string | string[]> = {
    super: 'all',
    editor: ['dashboard', 'pages', 'pageEdit', 'carousel', 'media', 'programmes', 'announcements', 'activity', 'settings'],
    enquiry: ['dashboard', 'enquiries', 'activity', 'settings']
  };
  const perm = A[role];
  if (!perm) return false;
  return perm === 'all' || perm.includes(view);
}

function getViewFromPath(pathname: string): string | null {
  if (pathname === '/admin') return 'dashboard';
  if (pathname.startsWith('/admin/pages/')) return 'pageEdit';
  if (pathname === '/admin/pages') return 'pages';
  if (pathname === '/admin/carousel') return 'carousel';
  if (pathname === '/admin/media') return 'media';
  if (pathname === '/admin/programmes') return 'programmes';
  if (pathname === '/admin/announcements') return 'announcements';
  if (pathname === '/admin/enquiries') return 'enquiries';
  if (pathname === '/admin/users') return 'users';
  if (pathname === '/admin/activity') return 'activity';
  if (pathname === '/admin/settings') return 'settings';
  return null;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Only protect /admin routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const isPublicAuthPath = PUBLIC_AUTH_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'));
  const isMfaPath = MFA_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'));

  // 1. Unauthenticated users
  if (!user) {
    if (isPublicAuthPath) {
      return response;
    }
    const redirectUrl = new URL('/admin/login', request.url);
    if (pathname !== '/admin') {
      redirectUrl.searchParams.set('next', pathname);
    }
    return NextResponse.redirect(redirectUrl);
  }

  // 2. Fetch profile from database
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, status')
    .eq('id', user.id)
    .single();

  const role = profile?.role || 'super';
  const status = profile?.status || 'active';

  // Suspended user
  if (status === 'suspended') {
    if (pathname === '/admin/locked') return response;
    return NextResponse.redirect(new URL('/admin/locked', request.url));
  }

  // 3. Authenticated user visiting /admin/login -> redirect to /admin
  if (pathname === '/admin/login') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // 4. MFA check for Super Admins
  if (role === 'super') {
    const { data: aalData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    const currentAal = aalData?.currentLevel;

    if (currentAal === 'aal1') {
      const { data: factors } = await supabase.auth.mfa.listFactors();
      const hasTotp = (factors?.totp?.length || 0) > 0;

      if (!hasTotp && pathname !== '/admin/two-factor/setup') {
        return NextResponse.redirect(new URL('/admin/two-factor/setup', request.url));
      }
      if (hasTotp && pathname !== '/admin/two-factor') {
        return NextResponse.redirect(new URL('/admin/two-factor', request.url));
      }
      // If already on the required MFA route, allow access
      if (isMfaPath) return response;
    } else {
      // Already aal2 (verified MFA), don't stay on MFA pages
      if (isMfaPath) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
    }
  } else {
    // Non-super admin visiting MFA setup/challenge without need
    if (isMfaPath) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  // 5. If this is another public screen (like access-denied or error), allow it
  if (isPublicAuthPath) {
    return response;
  }

  // 6. Check view-level role permissions
  const view = getViewFromPath(pathname);
  if (view && !isAllowed(view, role)) {
    return NextResponse.redirect(new URL('/admin/access-denied', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
