import { useState, useEffect, useContext, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';

import { AuthContext, AuthContextProps } from '../../context/contextApi';
import NewItem from '../NewItem/NewItem';
import TodoItem from '../TodoItem/TodoItem';
import './Todo.css';

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  padding: 10,
  margin: `10px 50px 15px 50px`,
  background: isDragging ? '#2B2E4A' : '#1FAB89',
  color: isDragging ? 'black' : 'white',
  border: `1px solid black`,
  fontSize: `16px`,
  borderRadius: `5px`,

  ...draggableStyle,
});

const Todo: React.FC = () => {
  const [todoList, setTodoList] = useState<Array<string>>([]);
  const navigate = useNavigate();

  const { user, fetchTodoData, todoItems, logout }: AuthContextProps =
    useContext(AuthContext);

  useEffect(() => {
    fetchTodoData();
  }, []);

  // Update todoList when todoItems state changes
  useEffect(() => {
    if (todoItems?.length > 0) {
      setTodoList(todoItems);
    } else {
      setTodoList([]);
    }
  }, [todoItems]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const items = Array.from(todoList);
    const [newOrder] = items.splice(source.index, 1);
    items.splice(destination.index, 0, newOrder);

    setTodoList(items);
  };

  const logoutUser = (e: FormEvent) => {
    e.preventDefault();
    logout();
    navigate('/login');
  };

  return (
    <div className='todo-div'>
      <h2>Hi {user && user} </h2>
      <NewItem />

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='droppable-1'>
          {(provided: any) => (
            <div
              className='todo'
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <ul className='todo-list'>
                {todoList.map((item: any, index: number) => {
                  return (
                    <Draggable
                      key={item._id}
                      draggableId={item._id}
                      index={index}
                    >
                      {(provided: any, snapshot: any) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          <TodoItem _id={item._id} text={item.text} />
                        </div>
                      )}
                    </Draggable>
                  );
                })}
              </ul>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className='logout-div'>
        <button onClick={logoutUser}>Log Out</button>
      </div>
    </div>
  );
};

export default Todo;
