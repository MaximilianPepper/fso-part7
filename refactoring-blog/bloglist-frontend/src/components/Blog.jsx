import { useState } from "react";
import PropTypes from "prop-types";

const Blog = ({ blog, increaseLikes, deleteBlog }) => {
  const [visible, setVisible] = useState(false);

  let loggedUserString = localStorage.getItem("loggedUser");

  let loggedUserObject = JSON.parse(loggedUserString);

  let name = loggedUserObject.name;
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const handleClick = () => {
    let res = !visible;
    setVisible(res);
  };

  return (
    <div className="blog" style={blogStyle}>
      <div>
        <p>{blog.title}</p> <p>{blog.author}</p>{" "}
        <button onClick={handleClick}>view</button>
      </div>
      {visible ? (
        <>
          <p>{blog.url}</p>
          <p>likes: {blog.likes}</p>
          <button onClick={() => increaseLikes(blog)}>like</button>
          {blog.user && <p>{blog.user.name} </p>}
          {name === blog.user.name && (
            <button onClick={() => deleteBlog(blog)}>remove</button>
          )}
        </>
      ) : null}
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  increaseLikes: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
};

export default Blog;
