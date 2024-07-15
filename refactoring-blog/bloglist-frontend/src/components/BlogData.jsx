import PropTypes from "prop-types";
import { useParams, useNavigate } from "react-router-dom";

const BlogData = ({ blogs, increaseLikes, deleteBlog }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  let loggedUserString = localStorage.getItem("loggedUser");
  const blog = blogs.find((b) => b.id === id);
  let loggedUserObject = JSON.parse(loggedUserString);

  let name = loggedUserObject.name;
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const handleDelete = async () => {
    await deleteBlog(blog);
    navigate("/");
  };
  if (!blog) return null;
  return (
    <div className="blog" style={blogStyle}>
      <h2>
        {blog.title} by {blog.author}
      </h2>
      <a href="{blog.url}">{blog.url}</a>

      <p>likes: {blog.likes}</p>
      <button onClick={() => increaseLikes(blog)}>like</button>
      <p>added by {blog.user.name}</p>
      {name === blog.user.name && (
        <button onClick={handleDelete}>remove</button>
      )}
    </div>
  );
};

BlogData.propTypes = {
  blogs: PropTypes.array.isRequired,
  increaseLikes: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
};

export default BlogData;
