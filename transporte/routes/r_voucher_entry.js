const express = require('express');
const router = express.Router();
/* const controller = require(''); */
const {
    body
} = require('express-validator');

router.get('/', (req,res)=>{
    res.render('./voucher_assign/voucher_entry.html')
});

module.exports = router;