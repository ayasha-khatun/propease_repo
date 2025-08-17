import { useEffect, useState } from 'react';
import useAuth from './useAuth';
import axios from 'axios';

const useRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (user?.email) {
      axios
        .get(`http://localhost:5000/users/role/${user.email}`)
        .then((res) => setRole(res.data.role))
        .catch(() => setRole('user'));
    }
  }, [user]);

  return { role };
};

export default useRole;
