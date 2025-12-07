import apiClient from './apiClient';

export const fetchContacts = async () => {
  const res = await apiClient.get('/api/User/GetAll');

  const apiUsers = res?.data?.data?.users ?? [];

  const contacts = apiUsers.map(u => ({
    id: u.id,
    firstName: u.firstName,
    lastName: u.lastName,
    phoneNumber: u.phoneNumber,
    profileImageUrl: u.profileImageUrl,
    createdAt: u.createdAt,
    isInDeviceContacts: false,
  }));

  return contacts;
};

export const createContact = async payload => {
  const body = {
    firstName: payload.firstName,
    lastName: payload.lastName,
    phoneNumber: payload.phoneNumber,
    profileImageUrl: payload.profileImageUrl,
  };

  const res = await apiClient.post('/api/User', body);
  return res?.data;
};

export const getContactById = async id => {
  const res = await apiClient.get(`/api/User/${id}`);
  return res?.data?.data;
};

export const updateContact = async (id, payload) => {
  const body = {
    firstName: payload.firstName,
    lastName: payload.lastName,
    phoneNumber: payload.phoneNumber,
    profileImageUrl: payload.profileImageUrl,
  };

  const res = await apiClient.put(`/api/User/${id}`, body);
  return res?.data;
};

export const deleteContact = async id => {
  const res = await apiClient.delete(`/api/User/${id}`);
  return res?.data;
};

export const uploadImage = async formData => {
  try {
    const res = await apiClient.post('/api/User/UploadImage', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000,
    });
    return res?.data;
  } catch (error) {
    console.log(
      'Upload image error:',
      error?.response?.status,
      error?.response?.data || error?.message || error,
    );
    throw error;
  }
};
