const userRepo = require('../models/userRepository');
const User = require('../models/user');
const userRepository = require("../models/userRepository");

async function findUser(userId) {

    const [rawDataUser] = await userRepo.findUser(userId);

    if (rawDataUser === undefined) {
        return null
    } else {
        return new User(rawDataUser.Id, rawDataUser.NameOfUser, rawDataUser.Email, rawDataUser.RoleOfUser, rawDataUser.AccountPassword);
    }

}

async function findUserByEmail(email) {

    const [rawDataUser] = await userRepo.findUserByEmail(email);

    if (rawDataUser === undefined) {
        return null
    } else {
        return new User(rawDataUser.Id, rawDataUser.NameOfUser, rawDataUser.Email, rawDataUser.RoleOfUser, rawDataUser.AccountPassword);
    }

    return new User(rawDataUser.Id, rawDataUser.NameOfUser, rawDataUser.Email, rawDataUser.RoleOfUser, rawDataUser.AccountPassword);
}

async function getAllUsers() {
    return await userRepository.getAllUsers();
}

async function searchUsers(searchTerm) {
    return await userRepository.searchUsers(searchTerm);
}

async function deleteUser(id) {
    return await userRepository.deleteUser(id);
}

async function addUser(ID, fullName, email, password, role) {
    return await userRepository.addUser(ID, fullName, email, password, role);
}

async function updateUser(sql, values) {
    return await userRepository.updateUser(sql, values);
}

module.exports = {
    findUser,
    findUserByEmail,
    getAllUsers,
    searchUsers,
    deleteUser,
    addUser,
    updateUser
}