export const fieldKeyFilter = (data, { formKey, fieldKey }) => {
  let entries = Object.entries(data);
  if (formKey)
    entries = entries.filter(([key]) => key.split('_')[0] === formKey);
  if (fieldKey)
    entries = entries.filter(([key]) => key.split('_')[1] === fieldKey);
  return entries.map(([, value]) => value).flat(1);
};
