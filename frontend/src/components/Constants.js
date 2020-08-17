const API = {
    baseUrl: "http://" + window.location.hostname + ":5050",
    authentication: "/users",
    modules: "/modules",
    stats: "/stats",
    settings: "/settings"
};

export default API;
export { API };