const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const studentController = require('../controllers/studentController');
const testController = require('../controllers/testController');
const { requireLogin } = require('../middlewares');

// Auth Routes
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Sync/Async Routes
router.get('/heavy-sync', testController.heavySync);
router.get('/heavy-async', testController.heavyAsync);

// Student Routes 
router.use('/students', requireLogin); 

// ĐẶT STATS LÊN TRÊN :ID
router.get('/students/stats', studentController.getStats);
router.get('/students/stats/class', studentController.getClassStats);

router.get('/students', studentController.getAll);
router.get('/students/:id', studentController.getById);
router.post('/students', studentController.create);
router.put('/students/:id', studentController.update);
router.delete('/students/:id', studentController.softDelete);

module.exports = router;