import client from './http.client';

export const UploadService = {
  async uploadImage(uri: string, type: string, name: string) {
    const formData = new FormData();
    formData.append('file', {
      uri,
      type,
      name,
    } as any);

    const response = await client.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
