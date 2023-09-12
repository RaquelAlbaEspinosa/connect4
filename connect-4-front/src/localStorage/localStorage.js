export const saveLocalStorage = (keyName, item) => {
    window.localStorage.setItem(keyName, item);
}
export const getLocalStorage = (keyName) => {
    const item = localStorage.getItem(keyName);
    return item;
}
export const deleteLocalStorage = (keyName) => {
    localStorage.removeItem(keyName);
    return true;
}
