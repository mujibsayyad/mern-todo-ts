import { useState, useContext, useRef } from 'react';
import { AuthContext, AuthContextProps } from '../../context/contextApi';
import './NewItem.css';

const NewItem: React.FC = () => {
  const [text, setText] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);
  const { token, createTodo }: AuthContextProps = useContext(AuthContext);

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) return;

    try {
      if (token) {
        createTodo(text, token);
        setText('');

        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    } catch (error) {
      console.log('🚀 addTodo ~ error:', error);
    }
  };

  return (
    <div className='NewItem'>
      <form method='POST'>
        <input
          type='text'
          placeholder='Whats plan for today?'
          value={text}
          onChange={(e) => setText(e.target.value)}
          ref={inputRef}
        />
        <button onClick={addTodo}>Add</button>
      </form>
    </div>
  );
};

export default NewItem;
