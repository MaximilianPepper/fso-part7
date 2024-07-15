const userReducer = (state = null, action) => {
  switch (action.type) {
    case "LOGGED":
      return action.payload;
    case "LOGOUT":
      return null;
    default:
      return state;
  }
};

export default userReducer;
