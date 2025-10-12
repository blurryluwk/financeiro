// src/repositories/categoryRepository.js

let categories = []; // banco temporário em memória
let currentId = 1;

const findAll = () => {
  return categories;   
}

const findById = (id) => {
  return categories.find(c => c.id === parseInt(id));
}

const create = ({ name }) => {
  const newCategory = { id: currentId++, name };
  categories.push(newCategory);
  return newCategory;
}

const findByUserId = (userId) => {
  return categories.filter(c => c.userId === userId);
}

module.exports = { findAll, findById, create, findByUserId };