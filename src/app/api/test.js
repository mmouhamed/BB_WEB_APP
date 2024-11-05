const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
  
    if (res.ok) {
      window.location.href = '/protected'; // Change as necessary
    } else {
      const errorData = await res.json();
      setError(errorData.message || 'Login failed. Please try again.');
    }
  };