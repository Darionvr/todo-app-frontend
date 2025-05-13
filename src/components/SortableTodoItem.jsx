
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function SortableTodoItem({ todo, removeTodo, updateTodo }) {

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: todo.id });
  const style = { transition, transform: CSS.Transform.toString(transform) };

  return (
    <li
      key={todo.id}
      {...attributes}
      ref={setNodeRef}
      style={style}


    >
      <label className="opcion" >

        <input type="checkbox"
          checked={todo.done}
          onChange={() => {
            updateTodo(todo.id);
          }}
        />


        <p
          {...listeners}
          style={todo.done ? { textDecoration: "line-through", color: "var(--inactiveFonts)" } : null}
          className="todo-text"
        >
          {todo.title}
        </p>
      </label>
      <img
        onClick={() => removeTodo(todo.id)}
        className="cross-icon"
        src="images/icon-cross.svg"
        alt="remove cross icon"
      />
    </li>
  );
}

export default SortableTodoItem;