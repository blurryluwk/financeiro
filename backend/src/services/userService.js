const UserRepository = require("../repositories/userRepository");

const UserService = {
  register: ({ name, email, password }) => {
    if (!name || !email || !password) {
      throw { status: 400, message: "Preencha todos os campos" };
    }

    const existingUser = UserRepository.findByEmail(email);
    if (existingUser) {
      throw { status: 409, message: "E-mail já cadastrado" };
    }

    //add criptografia de senha, validação de email
    const newUser = UserRepository.create({ name, email, password });
    return newUser;
  },

  login: ({ email, password }) => {
    const user = UserRepository.findByEmail(email);
    if (!user) throw { status: 404, message: "Usuário não encontrado" };
    if (user.password !== password) throw { status: 401, message: "Senha incorreta" };

    // gerar um JWT em vez de retornar a senha
    return { id: user.id, name: user.name, email: user.email };
  },

  listUsers: () => {
    return UserRepository.findAll();
  },
};

module.exports = UserService;
