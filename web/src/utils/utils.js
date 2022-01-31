export default {
  getValidationError(err) {
    const validationErrors = {};

    err.inner.forEach((error) => {
      validationErrors[error.path] = error.message;
    });

    return validationErrors;
  },
  hourToMinutes: (hourMinute) => {
    const [hour, minutes] = hourMinute.split(':');
    return parseInt(parseInt(hour, 10) * 60 + parseInt(minutes, 10), 10);
  },
};
