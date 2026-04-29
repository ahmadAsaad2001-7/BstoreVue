import { api } from './UserService'; 


export const fetchAdminVotes = async () => {
  const response = await api.get('/admin/getvotes');
  return response.data; 
};

export const castAdminVote = async (voteId, isApproved) => {

  const response = await api.post(`/admin/votes/${voteId}/cast`, isApproved);
  return response.data;
};