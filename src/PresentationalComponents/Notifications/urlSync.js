export const getNavFromURL = (history, fields, defaults) => {
  const searchParams = new URLSearchParams(history?.location?.search);
  const params = Object.fromEntries(searchParams);

  if (
    fields.some(
      (bundle) =>
        bundle.name === params.bundle &&
        bundle.fields.some((app) => app.name === params.app)
    )
  ) {
    return params;
  } else {
    if (defaults.bundle && defaults.app) {
      searchParams.set('bundle', defaults.bundle);
      searchParams.set('app', defaults.app);
      history.replace({
        pathname: history.location.pathname,
        search: searchParams.toString(),
      });
    }
    return { ...params, ...defaults };
  }
};

export const setNavToURL = (history, params) => {
  let searchParams = new URLSearchParams(history?.location?.search);
  Object.entries(params).forEach(([key, value]) => {
    searchParams.set(key, value);
  });

  history.replace({
    pathname: history.location.pathname,
    search: searchParams.toString(),
  });
};
