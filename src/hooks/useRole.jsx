import { useEffect, useState } from 'react';
import axios from 'axios';
import useAuth from './useAuth';

const useRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      axios
        .get(`http://localhost:5000/users/role/${user.email}`)
        .then((res) => {
          setRole(res.data.role);
          setLoading(false);
        })
        .catch(() => {
          setRole('user'); // default role if error
          setLoading(false);
        });
    } else {
      setRole(null);
      setLoading(false);
    }
  }, [user]);

  return { role, loading };
};

export default useRole;
