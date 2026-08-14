import toast from 'react-hot-toast';

export const getApiErrorMessage = (error, fallback = 'Something went wrong') => {
  const data = error?.response?.data;
  if (!data) return fallback;

  if (data.errors?.length) {
    return data.errors.map((e) => e.message).join(', ');
  }

  return data.message || fallback;
};

export const showApiError = (error, fallback) => {
  toast.error(getApiErrorMessage(error, fallback));
};

export const setFormApiErrors = (error, setError) => {
  const errors = error?.response?.data?.errors;
  if (!errors?.length) return false;

  errors.forEach(({ field, message }) => {
    if (field) setError(field, { message });
  });

  return true;
};
