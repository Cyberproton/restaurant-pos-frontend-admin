const checkLogin = () => {
    return localStorage.getItem("token") != null;
};

export { checkLogin }