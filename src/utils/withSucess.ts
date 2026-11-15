export const withSuccess = (message?: string) =>
  !message
    ? "Done successfully"
    : /successfully/i.test(message)
      ? message
      : `${message} successfully`;
