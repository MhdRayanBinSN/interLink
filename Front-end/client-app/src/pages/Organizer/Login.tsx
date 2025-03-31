// In your login submit handler
const handleLogin = async (formData) => {
  try {
    const response = await axios.post(`${serverUrl}/organizer/login`, formData);
    
    if (response.data.success) {
      // Store both token and organizer ID
      localStorage.setItem('organizer_token', response.data.accessToken);
      localStorage.setItem('organizerId', response.data.organizerId);
      
      toast.success('Login successful!');
      
      // Redirect to dashboard or return URL
      const returnUrl = location.state?.returnUrl || '/organizer/dashboard';
      navigate(returnUrl);
    }
  } catch (error) {
    console.error('Login error:', error);
    toast.error(error.response?.data?.message || 'Login failed');
  }
};