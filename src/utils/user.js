export function getUser() {
  const itemStr = localStorage.getItem('userXor');
  // if the item doesn't exist, return null
  if (!itemStr) {
    return null;
  }
  const item = JSON.parse(itemStr);
  const now = new Date();
  // compare the expiry time of the item with the current time
  if (item.expiry !== 0 && now.getTime() > item.expiry) {
    // If the item is expired, delete the item from storage
    // and return null
    localStorage.removeItem('userXor');
    return null;
  }
  return item.user;
}

export function setUser(user, remember = true) {
  const now = new Date();

  // `item` is an object which contains the original value
  // as well as the time when it's supposed to expire
  const item = {
    user: { ...user, remember },
    expiry: remember ? 0 : now.getTime() + 60 * 60 * 1000,
  };
  localStorage.setItem('userXor', JSON.stringify(item));
}

export function deleteUser() {
  localStorage.removeItem('userXor');
}

export function isEditableUser(user) {
  return user.permission ? user.permission.includes('EDIT_PERMISSION') : false;
}
