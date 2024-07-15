import userService from "../services/users";
import { useState, useEffect } from "react";
const Users = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    userService.getAll().then((u) => setUsers(u));
  }, []);
  if (!users) return;
  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
