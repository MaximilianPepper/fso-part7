import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import Users from "./components/Users";
import blogService from "./services/blogs";
import loginService from "./services/login";
import "./app.css";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Toggable";
import { useSelector, useDispatch } from "react-redux"; // redux refactoring es 7.10
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // redux
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.notification); // is object with .notification and .class properties
  const blogs = useSelector((state) => state.blogs);
  const user = useSelector((state) => state.user);

  const blogRef = useRef();
  useEffect(() => {
    blogService.getAll().then((blogs) => {
      dispatch({
        type: "GET",
        payload: [...blogs].sort((a, b) => b.likes - a.likes),
      });
    });
  }, []);
  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedUser", JSON.stringify(user));
      blogService.setToken(user.token);

      dispatch({ type: "LOGGED", payload: user });
      setUsername("");
      setPassword("");
      dispatch({
        type: "SET",
        payload: `logged in as ${user.username}`,
      });
      setTimeout(() => dispatch({ type: "RESET" }), 5000);
    } catch (exception) {
      dispatch({
        type: "ERROR",
        payload: `wrong username or password`,
      });
      setTimeout(() => dispatch({ type: "RESET" }), 5000);
    }
  };

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch({ type: "LOGGED", payload: user });
      blogService.setToken(user.token);
    }
  }, []);

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );
  const logout = () => {
    dispatch({
      type: "ERROR",
      payload: `logged out, take care ${user.username}`,
    });
    setTimeout(() => dispatch({ type: "RESET" }), 5000);
    dispatch({ type: "LOGOUT" });
    window.localStorage.clear();
  };

  const createBlog = async (blog) => {
    const newBlog = await blogService.create(blog);
    dispatch({ type: "POST", payload: newBlog });
    dispatch({
      type: "SET",
      payload: `a new blog ${newBlog.title} by ${newBlog.author}`,
    });
    setTimeout(() => dispatch({ type: "RESET" }), 5000);
    blogRef.current.toggleVisibility();
  };

  const increaseLikes = async (blog) => {
    const updatedBlog = await blogService.likeBlog(blog);
    dispatch({ type: "LIKE", payload: blog.id });
    dispatch({
      type: "SET",
      payload: `${updatedBlog.title} by ${updatedBlog.author} is liked!`,
    });
    setTimeout(() => dispatch({ type: "RESET" }), 5000);
  };

  const deleteBlog = async (blog) => {
    await blogService.deleteBlog(blog.id);
    dispatch({
      type: "ERROR",
      payload: `${blog.title} by ${blog.author} IS DELETED!`,
    });
    setTimeout(() => dispatch({ type: "RESET" }), 5000);
    dispatch({ type: "DELETE", payload: blog.id });
  };
  const loggedIn = () => (
    <Router>
      <nav>
        <Link to="/">blogs </Link>
        <Link to="/users">users </Link>
        {user.name} logged in
      </nav>
      <button onClick={() => logout()}>logout</button>
      <Togglable buttonName="new blog" ref={blogRef}>
        <BlogForm createBlog={createBlog} />
      </Togglable>
      <Routes>
        <Route
          path="/"
          element={blogs.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              increaseLikes={increaseLikes}
              deleteBlog={deleteBlog}
            />
          ))}
        />
        <Route path="/users" element={<Users />} />
      </Routes>
    </Router>
  );
  return (
    <div>
      <h2>{user ? "blogs" : "login to application"}</h2>
      {notification && (
        <div className={notification.class}>{notification.notification}</div>
      )}
      {user ? loggedIn() : loginForm()}
    </div>
  );
};

export default App;
