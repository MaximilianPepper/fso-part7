import { useState, useEffect, useRef } from "react";
import BlogData from "./components/BlogData";
import Users from "./components/Users";
import UserData from "./components/UserData";
import blogService from "./services/blogs";
import loginService from "./services/login";
import userService from "./services/users";
import "./app.css";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Toggable";
import { useSelector, useDispatch } from "react-redux"; // redux refactoring es 7.10
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
  Alert,
  Button,
  Form,
  Navbar,
  Nav,
  Card,
  Row,
  Col,
  Container,
} from "react-bootstrap";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // redux
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.notification); // is object with .notification and .class properties
  const blogs = useSelector((state) => state.blogs);
  const user = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);

  const blogRef = useRef();
  useEffect(() => {
    blogService.getAll().then((blogs) => {
      dispatch({
        type: "GET",
        payload: [...blogs].sort((a, b) => b.likes - a.likes),
      });
    });
  }, []);
  // this could be better
  useEffect(() => {
    userService.getAll().then((u) => setUsers(u));
  }, [blogs]);
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

  const BlogList = () => (
    <Container>
      <Row>
        {blogs.map((blog) => (
          <Col key={blog.id} sm={12} md={6} lg={4} className="mb-4">
            <Link to={`/blogs/${blog.id}`} style={{ textDecoration: "none" }}>
              <Card
                style={{
                  cursor: "pointer",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  ":hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Card.Body>
                  <Card.Title>{blog.title}</Card.Title>
                  <Card.Text>by {blog.author}</Card.Text>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </Container>
  );
  const loginForm = () => (
    <Form onSubmit={handleLogin}>
      <Form.Group>
        <Form.Label>username</Form.Label>
        <Form.Control
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>password</Form.Label>
        <Form.Control
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </Form.Group>
      <Button className="bottone-spazio" variant="primary" type="submit">
        login
      </Button>
    </Form>
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
  const createComment = async (id, comment) => {
    const updatedBlog = await blogService.commentBlog(id, comment);
    dispatch({ type: "COMMENT", payload: updatedBlog });
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
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto navbar-nav">
            <Nav.Link href="#" as="span">
              <Link to="/">blogs </Link>
            </Nav.Link>
            <Nav.Link href="#" as="span">
              <Link to="/users">users </Link>
            </Nav.Link>
            <Nav.Link href="#" as="span">
              <em>{user.name} logged in</em>
            </Nav.Link>
            <Nav.Link href="#" as="span">
              <Button variant="info" onClick={() => logout()}>
                logout
              </Button>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Togglable buttonName="new blog" ref={blogRef}>
        <BlogForm createBlog={createBlog} />
      </Togglable>
      <Routes>
        <Route path="/users/:id" element={<UserData users={users} />} />
        <Route
          path="/blogs/:id"
          element={
            <BlogData
              blogs={blogs}
              increaseLikes={increaseLikes}
              deleteBlog={deleteBlog}
              createComment={createComment}
            />
          }
        />
        <Route path="/" element={<BlogList />} />
        <Route path="/users" element={<Users users={users} />} />
      </Routes>
    </Router>
  );
  return (
    <div className="container">
      <h2>{user ? "Blogs" : "login to application"}</h2>
      {notification && (
        <Alert variant={notification.class}>{notification.notification}</Alert>
      )}
      {user ? loggedIn() : loginForm()}
    </div>
  );
};

export default App;
