import KezulerInstance from 'src/constants/api';

const addTimes = async (eventId: string | undefined, params: number[]) => {
  const result = await KezulerInstance.patch(
    `/pendingEvents/${eventId}/addTimes`,
    {
      eventTimeCandidates: params,
    }
  );
  return result;
};

export { addTimes };
