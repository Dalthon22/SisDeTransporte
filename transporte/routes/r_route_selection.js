const express = require('express');
const routeS_controller = require('../controllers/c_route_selection');

const {
    body
} = require('express-validator');
const router = express.Router();

/*GET List*/
router.get('/', (req, res) => {
    routeS_controller.getList(req, res);
});

module.exports = router