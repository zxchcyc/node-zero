export const locationFilter = (datas, location) =>
  location
    ? datas.filter((data) =>
        Object.keys(location).every((key) => data[key] === location[key]),
      )
    : datas;
