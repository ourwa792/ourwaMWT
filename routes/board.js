const route = require("express").Router();

route.get('/board', (req, res) => {
    res.render('board', {pageTitle: "لوح الرسم"})
})

module.exports = route