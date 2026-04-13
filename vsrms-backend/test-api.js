const axios = require('axios');
async function test() {
  try {
    const wsRes = await axios.get('http://localhost:5000/api/v1/workshops');
    const wsId = wsRes.data.data[0]._id;
    console.log('Testing with Workshop:', wsRes.data.data[0].name, wsId);
    
    // Mock user token for owner
    const res = await axios.get(`http://localhost:5000/api/v1/appointments/workshop/${wsId}`, {
      headers: { Authorization: 'Bearer mock-workshop_owner' }
    });
    console.log('Appointments:', res.data.data.length);
  } catch (err) {
    console.error('Error:', err.response?.data || err.message);
  }
}
test();
