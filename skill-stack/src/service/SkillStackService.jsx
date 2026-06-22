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
          Authorization: `Bearer ${token}`,  //send token in header
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
   
      //Payment Integration with PayPal
 

 async makeRazorpayPayment(amount, token, noteId, userEmail) {
    try {
      // Step 1: Create Razorpay order
      const res = await axios.post(
        `${USER_RELATED_URL}/razorpay/create-order?amount=${amount}`,
        {},
        {
          headers: { Authorization: token ? `Bearer ${token}` : undefined },
          validateStatus: () => true,
        }
      );

      console.log("Razorpay Response:", res.data);

      if (res.status !== 200 || !res.data.orderId) {
        return { success: false, message: res.data.message || "Order creation failed" };
      }

      const { orderId, amount: orderAmount, currency, key } = res.data;

      // Step 2: Open Razorpay popup
      const options = {
        key: key,
        amount: orderAmount,
        currency: currency,
        name: "SkillStack",
        description: "Note Purchase",
        order_id: orderId,
        handler: async function (response) {
          console.log("✅ Payment successful:", response);
          alert("Payment Successful! Verifying...");

          try {
            const verifyRes = await axios.post(
              `${USER_RELATED_URL}/razorpay/verify?noteId=${noteId}&userEmail=${userEmail}`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: { Authorization: token ? `Bearer ${token}` : undefined },
              }
            );

            if (verifyRes.data.success) {
              alert("✅ Payment Verified and Note Added to Your Purchases!");
              console.log("Verified payment:", verifyRes.data);
            } else {
              alert("⚠️ Verification Failed: " + verifyRes.data.message);
            }
          } catch (err) {
            console.error("Verification error:", err);
            alert("Server verification failed!");
          }
        },
        prefill: {
          //name: user?.name || "Student",
          email: userEmail,
         // contact: user?.phoneno || "9999999999",
        },
        theme: {
          color: "#F37254",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();//through which rasorpay popup display
      

      return { success: true };
    } catch (err) {
      console.error("⚠️ Razorpay payment failed:", err);
      return { success: false, message: err.message || "Payment initiation failed" };
    }
  }


  }
export default new SkillStackService();
