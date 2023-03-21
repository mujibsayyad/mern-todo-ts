const User = require('../models/UserSchema');
const Todo = require('../models/TodoSchema');

exports.createTodo = async (req, res) => {
  let text = req.body.text;

  if (!text) {
    return res.status(422).json({ message: 'Todo is empty' });
  }

  try {
    let todo = new Todo({ text, user: req.user.userId });
    await todo.save();

    res.status(201).json({ message: 'Added To Todo List' });
  } catch (error) {
    console.log('🚀 createTodo ~ error:', error);
    res
      .status(400)
      .json({ message: 'could not create todo, please try again later.' });
  }
};

exports.getTodo = async (req, res) => {
  const postId = req.params.id;

  const findTodo = await Todo.findById(postId);

  res.status(201).json(findTodo.text);
};

exports.readTodo = async (req, res) => {
  try {
    let user = await User.findById(req.user.userId).select('name');
    const findTodo = await Todo.find({ user: req.user.userId });

    res.status(201).json({ user: user, todoList: findTodo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTodo = async (req, res) => {
  let { id } = req.params;
  let { text } = req.body;
  const userId = req.user.userId;

  if (!text) {
    return res.status(422).json({ message: 'Todo is empty' });
  }

  try {
    const todo = await Todo.findById(id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    if (todo.user.toString() !== userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const updateTodo = await Todo.findByIdAndUpdate(
      id,
      { text },
      { new: true }
    );

    res.status(200).json(updateTodo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const todo = await Todo.findById(id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    if (todo.user.toString() !== userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await todo.deleteOne({ _id: id });

    res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
