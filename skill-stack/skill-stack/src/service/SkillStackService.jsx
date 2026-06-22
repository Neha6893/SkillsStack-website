import axios from 'axios';
 
const USER_RELATED_URL = "http://localhost:9090";

class SkillStackService {
  async getOtp(mail) {
    const res = await axios
          .post(`${USER_RELATED_URL}/auth/request-otp?mail=${mail}`);
      return res.data; 
  }

  async verifyOtp(mail, otp) {
    const res = await axios
          .post(`${USER_RELATED_URL}/auth/verify-otp?mail=${mail}&otp=${otp}`);
      return res.data;   
  }

  async updateUser(user,token){
    const res = await axios
        .put(`${USER_RELATED_URL}/user/update-user`,
          {"name":user.name,"phoneno":user.phoneno},
        {
        headers: {
          Authorization: `Bearer ${token}`,  // <-- send token in header
          "Content-Type": "application/json"
        }
      });
    return res.data;
  }

async uploadNotes(formData, token) {
   const res = await axios.post(
        `${USER_RELATED_URL}/api/notes/user`, 
        formData,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );
      return res.data;
    }

async getOwnedNotes(token) {

   const res = await axios.get(`${USER_RELATED_URL}/api/notes/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return res;
      }

async getUser(token) {

   const res = await axios.get(`${USER_RELATED_URL}/user/getuser`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return res;
      }


      async getAllNotes(token) {

   const res = await axios.get(`${USER_RELATED_URL}/api/notes/user/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return res;
      }
 async getAllNotesHome() {

   const res = await axios.get(`${USER_RELATED_URL}/api/notes/home/all`,  
        );
        return res;
      }
   

  // getUser(mail) {
  //   return axios.get(`${USER_RELATED_URL}/${mail}`).then((res) => res.data);
  // }

  // saveUser(user) {
  //   return axios.post(USER_RELATED_URL, user).then((res) => res.data);
  // }
}

export default new SkillStackService();
