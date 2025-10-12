let users = []; // "banco de dados" temporário

const findAll = () => {
  return users;
}

const findByEmail = (email) => {
  return users.find(u => u.email === email);
}

const create = ({ name, email, password }) => {
  const newUser = { id: users.length + 1, name, email, password };
  users.push(newUser);
  return newUser;
}

module.exports = { findAll, findByEmail, create };
