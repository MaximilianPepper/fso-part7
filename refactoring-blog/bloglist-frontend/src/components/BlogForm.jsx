import { useState } from "react";
import { Form, Button } from "react-bootstrap";

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const addBlog = async (event) => {
    event.preventDefault();
    createBlog({
      title: title,
      author: author,
      url: url,
      likes: 0,
    });
    setTitle("");
    setAuthor("");
    setUrl("");
  };

  const changeTitle = (e) => {
    setTitle(e.target.value);
  };
  const changeAuthor = (e) => {
    setAuthor(e.target.value);
  };
  const changeUrl = (e) => {
    setUrl(e.target.value);
  };
  return (
    <Form onSubmit={addBlog}>
      <Form.Group>
        <Form.Label>title</Form.Label>
        <Form.Control
          value={title}
          onChange={changeTitle}
          placeholder="title"
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>author</Form.Label>
        <Form.Control
          value={author}
          onChange={changeAuthor}
          placeholder="author"
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>url</Form.Label>
        <Form.Control value={url} onChange={changeUrl} placeholder="url" />
      </Form.Group>
      <Button variant="primary" type="submit">
        save
      </Button>
    </Form>
  );
};

export default BlogForm;
