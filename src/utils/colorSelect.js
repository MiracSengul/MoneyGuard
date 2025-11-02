export function colorSelect(category) {
  switch (category) {
    case "Main expenses":
      return "#FED057";
      break;
    case "Products":
      return "#FFD8D0";
      break;
    case "Car":
      return "#FD9498";
      break;
    case "Self care":
      return "#C5BAFF";
      break;
    case "Child care":
      return "#6E78E8";
      break;
    case "Household products":
      return "#4A56E2";
      break;
    case "Education":
      return "#81E1FF";
      break;
    case "Leisure":
      return "#24CCA7";
      break;
    case "Other expenses":
      return "#00AD84";
      break;
    case "Entertainment":
      return "#e20a5dff";
      break;
    default:
      return "#fff";
  }
}
