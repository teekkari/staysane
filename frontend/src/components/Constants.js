console.log(window.location.hostname);

const API = {
    baseUrl: "http://" + window.location.hostname + ":5000",

    authentication: "/users",

    modules: "/modules",
};

export default API;
export { API };