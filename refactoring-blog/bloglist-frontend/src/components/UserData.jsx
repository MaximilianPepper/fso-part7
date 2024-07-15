import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
const UserData = ({ users }) => {
  const { id } = useParams();
  const user = users.find((u) => u.id === id);
  if (!user) return null;
  return (
    <div>
      <h2>{user.name}</h2>
      <h4>added blogs</h4>
      <ul>
        {user.blogs && user.blogs.map((b) => <li key={b.id}>{b.title}</li>)}
      </ul>
    </div>
  );
};

export default UserData;
