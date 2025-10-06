export const testBackendConnection = async () => {
  try {
    console.log('🔍 Testing backend connection...');
    const response = await fetch('http://localhost:8000/api/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });
    
    console.log('📡 Backend response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend is responding:', data);
      return true;
    } else {
      console.log('❌ Backend error:', response.status, response.statusText);
      return false;
    }
  } catch (error) {
    console.error('❌ Backend connection failed:', error);
    return false;
  }
};




