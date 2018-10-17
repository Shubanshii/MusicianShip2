let express = require('express');
let router = express.Router();

//ROUTE ROUTE
router.get('/', (req, res) => {
  res.render('landing');
});

router.get('/login', (req, res) => {
  res.render('login');
});

module.exports = router;
