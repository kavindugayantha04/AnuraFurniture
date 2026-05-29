import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { completeGoogleAuth } from '../../store/slices/authSlice';
import { fetchCart } from '../../store/slices/cartSlice';
import { fetchWishlist } from '../../store/slices/wishlistSlice';
import LoadingScreen from '../../components/ui/LoadingScreen';

export default function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = searchParams.get('token');
    const redirect = searchParams.get('redirect') || '/';

    if (!token) {
      toast.error('Google sign-in failed. Please try again.');
      navigate('/login', { replace: true });
      return;
    }

    (async () => {
      const result = await dispatch(completeGoogleAuth({ token }));
      if (completeGoogleAuth.fulfilled.match(result)) {
        dispatch(fetchCart());
        dispatch(fetchWishlist());
        toast.success(`Welcome, ${result.payload.user.name}!`);
        navigate(redirect, { replace: true });
      } else {
        toast.error(result.payload || 'Google sign-in failed');
        navigate('/login', { replace: true });
      }
    })();
  }, [dispatch, navigate, searchParams]);

  return <LoadingScreen />;
}
