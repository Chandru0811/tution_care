export let SCREENS = {};

export const updateScreens = (permissions) => {
  localStorage.setItem("tmsscreens", JSON.stringify(permissions));
};
