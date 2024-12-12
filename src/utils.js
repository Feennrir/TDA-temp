export const calculateCommuneCenter = (coordinates) => {
  if (!Array.isArray(coordinates) || coordinates.length === 0) {
    throw new Error("Invalid coordinates");
  }

  let totalLongitude = 0;
  let totalLatitude = 0;
  let numPoints = 0;

  coordinates.forEach(polygon => {
    polygon.forEach(point => {
      totalLongitude += point[0];
      totalLatitude += point[1];
      numPoints++;
    });
  });

  return [totalLongitude / numPoints, totalLatitude / numPoints];
};


export const normalizePower = (puissance) => {
  const parsedPuissance = typeof puissance === "string" ? puissance : puissance.toString();
  const parsed = parseFloat(parsedPuissance.replace(",", "."));
  return parsed * 100;
};