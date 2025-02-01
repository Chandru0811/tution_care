export let SCREENS = {};

export const updateModules = (permissions) => {
  localStorage.setItem("tmsModules", JSON.stringify(permissions));
};
