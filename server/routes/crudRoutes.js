const express = require('express');
const router = express.Router();

const {
  createTodo,
  readTodo,
  getTodo,
  updateTodo,
  deleteTodo,
} = require('../controllers/todo');

const authentication = require('../middleware/check-auth');

router.use(authentication);

router.post('/create', createTodo);

router.get('/read', readTodo);

router.get('/get/:id', getTodo);

router.put('/update/:id', updateTodo);

router.delete('/delete/:id', deleteTodo);

module.exports = router;
