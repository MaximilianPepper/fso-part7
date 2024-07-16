const notificationReducer = (
  state = { notification: null, class: null },
  action
) => {
  switch (action.type) {
    case "SET":
      return { notification: action.payload, class: "success" };
    case "ERROR":
      return { notification: action.payload, class: "danger" };
    case "RESET":
      return { notification: null, class: "null" };
    default:
      return state;
  }
};

export default notificationReducer;
