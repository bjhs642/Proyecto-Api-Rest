const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    //res.send("Hola");
    res.render('index/index');
});

module.exports = router;
