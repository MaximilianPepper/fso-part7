const notificationReducer = (
  state = { notification: null, class: null },
  action
) => {
  switch (action.type) {
    case "SET":
      return { notification: action.payload, class: "notification" };
    case "ERROR":
      return { notification: action.payload, class: "error" };
    case "RESET":
      return { notification: null };
    default:
      return state;
  }
};

export default notificationReducer;
