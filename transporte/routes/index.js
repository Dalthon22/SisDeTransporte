const express = require('express')
const router = express.Router();
const db = require('../dbconfig/conex');


router.get('/', (req, res) => {
    res.render('login.html');
});

router.post('/auth', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    if (username && password) {
        db.query('SELECT * FROM SGT_Usuario WHERE email = ? AND password = ?', {
                replacements: [username, password],
                type: db.QueryTypes.SELECT
            }).then(results => {
                console.log(results);
                if (results.length > 0) {
                    var usuario = results[0].NombresUsuario;
                    console.log(usuario);
                    var url = encodeURI('/home?usuario=' + usuario)
                    res.redirect(url);
                } else {
                    res.send('Usuario o contraseña incorrecta');
                }
                res.end();
            })
            .catch(error => console.log(error));
    } else {
        res.send('Por favor, ingrese usuario y contraseña');
        res.end();
    }
});

router.get('/home', (req, res) => {
    var username = req.query.usuario;
    res.render('home.html', {
        username
    });
});

module.exports = router;