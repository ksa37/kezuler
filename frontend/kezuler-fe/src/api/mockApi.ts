const mockApi = (userId: string) => {
  return new Promise((res, rej) =>
    setTimeout(() => {
      if (!userId) {
        rej({ message: 'userId required' });
      }
      res({ data: `api called with user id ${userId}` });
    }, 3000)
  );
};

export default mockApi;
