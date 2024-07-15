const blogsReducer = (state = [], action) => {
  switch (action.type) {
    case "GET":
      return [...action.payload];
    case "POST":
      return [...state, action.payload];
    case "DELETE":
      const newBlogs = state.filter((blog) => blog.id !== action.payload);
      return [...newBlogs];
    case "LIKE":
      return state
        .map((b) =>
          b.id === action.payload ? { ...b, likes: b.likes + 1 } : b
        )
        .sort((a, b) => b.likes - a.likes);
    case "COMMENT":
      return state.map((b) =>
        b.id === action.payload.id ? action.payload : b
      );
    default:
      return state;
  }
};

export default blogsReducer;
