const userRepo = require('../models/userRepository');
const User = require('../models/user');

async function findUser(userId) {

    const [rawDataUser] = await userRepo.findUser(userId);

    return new User(rawDataUser.Id, rawDataUser.NameOfUser, rawDataUser.Email, rawDataUser.RoleOfUser, rawDataUser.AccountPassword);
}

module.exports = {
    findUser
}