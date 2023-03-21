import { useState, useContext } from 'react';
import { AuthContext, AuthContextProps } from '../../context/contextApi';
import './TodoItem.css';

interface TodoItemProps {
  _id: string;
  text: string;
}

const TodoItem: React.FC<TodoItemProps> = (props) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [todoId, setTodoId] = useState<string>('');
  const [text, setText] = useState<string>('');

  const {
    token,
    getTodoData,
    updateTodoData,
    deleteTodoData,
  }: AuthContextProps = useContext(AuthContext);

  const editTodoHandler = async (id: string) => {
    setIsEditing(true);
    setTodoId(id);
    console.log(id);

    if (token) {
      let getTodoValue = await getTodoData(id, token);
      setText(getTodoValue);
    }
  };

  const deleteTodoHandler = (id: string) => {
    if (token) {
      deleteTodoData(id, token);
    }
  };

  const renderUpdateForm = (id: string) => {
    if (token) {
      return (
        <form className='update-form' key={id}>
          <input
            type='text'
            placeholder='Update Todo'
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              if (!text.trim()) return;
              updateTodoData(todoId, text, token);
              setIsEditing(false);
              setText('');
            }}
          >
            Update
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsEditing(false);
            }}
          >
            Cancel
          </button>
        </form>
      );
    }
  };

  return (
    <div className='li-flex'>
      {isEditing ? (
        renderUpdateForm(props._id)
      ) : (
        <>
          <li key={props._id}>{props.text}</li>
          <i
            className='fa-solid fa-pencil'
            style={{ color: '#000000' }}
            onClick={() => editTodoHandler(props._id)}
          />
          <i
            className='fa-solid fa-trash'
            style={{ color: '#000000' }}
            onClick={() => deleteTodoHandler(props._id)}
          ></i>
        </>
      )}
    </div>
  );
};

export default TodoItem;
