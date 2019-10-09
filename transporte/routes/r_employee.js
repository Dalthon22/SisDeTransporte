const express = require('express')
const router = express.Router();
const controller = require('../controllers/c_employee');
const {
    body,
    check,
    validationResult
} = require('../middleware/expresse-validator');

router.get('/empleado/:id',
    (req, res) => {
        const id = req.params.id;
        console.log("Se buscará al empleado con id: " + id);
        controller.findById(id, req, res);
    });

module.exports = router;