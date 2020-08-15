const API = {
    baseUrl: "http://" + window.location.hostname + ":5000",
    authentication: "/users",
    modules: "/modules",
    stats: "/stats",
    settings: "/settings"
};

export default API;
export { API };