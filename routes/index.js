let express = require('express');
let router = express.Router();

//ROUTE ROUTE
router.get('/', (req, res) => {
  res.render('landing');
});

module.exports = router;
