import { getNavFromURL, setNavToURL } from './urlSync';

describe('getNavFromURL', () => {
  it('should return default output', () => {
    const result = getNavFromURL(
      { location: {}, replace: () => null },
      [],
      { bundle: 'rhel', app: 'advisor' },
      false
    );
    const expected = { bundle: 'rhel', app: 'advisor' };
    expect(result).toMatchObject(expected);
  });

  it('should return output from URL', () => {
    const result = getNavFromURL(
      { location: { search: '?bundle=group&app=test' }, replace: () => null },
      [{ name: 'group', fields: [{ name: 'test' }] }],
      { bundle: 'rhel', app: 'advisor' },
      false
    );
    const expected = { bundle: 'group', app: 'test' };
    expect(result).toMatchObject(expected);
  });
});

describe('setNavToURL', () => {
  it('should call replace with correct params', () => {
    const replace = jest.fn();
    setNavToURL(
      { location: { search: '?bundle=rhel&app=advisor' }, replace },
      { bundle: 'someBundle', app: 'someApp' }
    );
    expect(replace).toHaveBeenCalledWith({
      pathname: undefined,
      search: 'bundle=someBundle&app=someApp',
    });
  });
});
