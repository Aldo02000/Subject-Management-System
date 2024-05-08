const bcrypt = require("bcrypt");

module.exports =  class User {

    #password = null;

    constructor (id, name, email, role, password) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.#password = password;
    };

    async hasPassword(password) {
        return await bcrypt.compare(password, this.#password, function (err, result) {
            if (err) return false;

            return result;
        });
    };
}