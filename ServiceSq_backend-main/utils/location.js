const AppError = require("./AppError");

const toNumber = (value) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const number = Number(value);
  return Number.isNaN(number) ? undefined : number;
};

const assertCoordinates = (longitude, latitude) => {
  if (longitude === undefined || latitude === undefined) {
    throw new AppError("Both latitude and longitude are required.", 400);
  }

  if (longitude < -180 || longitude > 180) {
    throw new AppError("Longitude must be between -180 and 180.", 400);
  }

  if (latitude < -90 || latitude > 90) {
    throw new AppError("Latitude must be between -90 and 90.", 400);
  }
};

const buildPoint = (longitude, latitude) => {
  assertCoordinates(longitude, latitude);

  return {
    type: "Point",
    coordinates: [longitude, latitude]
  };
};

const getCoordinatesFromBody = (body) => {
  const bodyLongitude = toNumber(body.longitude);
  const bodyLatitude = toNumber(body.latitude);

  if (bodyLongitude !== undefined || bodyLatitude !== undefined) {
    return {
      longitude: bodyLongitude,
      latitude: bodyLatitude
    };
  }

  const coordinates = body.location && body.location.coordinates;

  if (Array.isArray(coordinates) && coordinates.length === 2) {
    return {
      longitude: toNumber(coordinates[0]),
      latitude: toNumber(coordinates[1])
    };
  }

  return {
    longitude: undefined,
    latitude: undefined
  };
};

module.exports = {
  buildPoint,
  getCoordinatesFromBody,
  toNumber
};
