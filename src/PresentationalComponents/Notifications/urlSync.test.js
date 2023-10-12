import { getNavFromURL, setNavToURL } from './urlSync';

const mockedNavigate = jest.fn();
const mockedLocation = jest.fn(() => ({}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
  useLocation: () => mockedLocation,
}));

describe('getNavFromURL', () => {
  afterEach(() => {
    mockedLocation.mockReset();
    mockedNavigate.mockReset();
  });

  it('should return default output', () => {
    const result = getNavFromURL(
      mockedLocation,
      mockedNavigate,
      [],
      { bundle: 'rhel', app: 'advisor' },
      false
    );
    const expected = { bundle: 'rhel', app: 'advisor' };
    expect(mockedNavigate).toBeCalledWith(
      { pathname: undefined, search: 'bundle=rhel&app=advisor' },
      { replace: true }
    );
    expect(result).toMatchObject(expected);
  });

  it('should return output from URL', () => {
    const result = getNavFromURL(
      { search: '?bundle=group&app=test' },
      mockedNavigate,
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
    setNavToURL({ search: '?bundle=rhel&app=advisor' }, mockedNavigate, {
      bundle: 'someBundle',
      app: 'someApp',
    });
    expect(mockedNavigate).toHaveBeenCalledWith(
      {
        pathname: undefined,
        search: 'bundle=someBundle&app=someApp',
      },
      { replace: true }
    );
  });
});
