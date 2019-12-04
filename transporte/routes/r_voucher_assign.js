const express = require('express');
const router = express.Router();
/* const controller = require(''); */
const {
    body
} = require('express-validator');

router.get('/', (req,res)=>{
    res.render('./voucher_assign/assign_list.html')
});

module.exports = router;