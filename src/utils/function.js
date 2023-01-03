const deepClone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
}

const setLoginState = (user, setIsLogin, setIsFirstTime) => {
    if (user === "null") {
        user = JSON.parse(user);
    }
    if (user === undefined || user === null) {
        setIsLogin(false);
        setIsFirstTime(false);
        return;
    }
    setIsLogin(true);
    setIsFirstTime(true);
}

const groupBy = (array, key) => {
    return array.reduce(function (pre, cur) {
        (pre[cur[key]] = pre[cur[key]] || []).push(cur);
        return pre;
    }, {});
};

export { deepClone, setLoginState, groupBy };