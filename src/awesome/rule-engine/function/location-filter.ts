export const locationFilter = (data, location) =>
  location
    ? data.filter((data) =>
        Object.keys(location).every((key) => data[key] === location[key]),
      )
    : data;
