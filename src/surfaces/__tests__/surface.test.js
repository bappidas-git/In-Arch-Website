import { getSurface } from '../surface';

describe('getSurface', () => {
  test.each([
    ['/admin', 'admin'],
    ['/admin/', 'admin'],
    ['/admin/login', 'admin'],
    ['/admin/lms/lead/abc', 'admin'],
    ['/', 'public'],
    ['/about', 'public'],
    ['/administrator', 'public'],
    ['/adminx/login', 'public'],
    ['/__lab', 'public'],
    ['', 'public'],
  ])('%s → %s', (pathname, surface) => {
    expect(getSurface(pathname)).toBe(surface);
  });

  // Must agree with the inline script in public/index.html.
  test('matches the boot-time regular expression', () => {
    const boot = (p) => (/^\/admin(\/|$)/.test(p) ? 'admin' : 'public');
    ['/admin', '/admin/x', '/', '/administrator', '/x/admin'].forEach((p) => expect(getSurface(p)).toBe(boot(p)));
  });
});
