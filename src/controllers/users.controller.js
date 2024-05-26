const register = (req, res, next) => {

    res.send('registrando');

}

const login = (req, res, next) => {

    res.send('logueando');

}

module.exports = {
    register, login
}