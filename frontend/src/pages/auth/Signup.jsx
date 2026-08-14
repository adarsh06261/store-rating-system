import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { signupSchema } from '../../utils/validation';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (data) => {
    try {
      await signup({ ...data, address: data.address || undefined });
      toast.success('Account created successfully');
      navigate('/stores');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">Create Account</h1>
          <p className="text-center text-gray-500 mb-6">Sign up as a normal user</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Name (20-60 characters)"
              placeholder="Your full name"
              error={errors.name?.message}
              {...register('name')}
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Password (8-16 chars, 1 uppercase, 1 special)"
              type="password"
              placeholder="Create a password"
              error={errors.password?.message}
              {...register('password')}
            />
            <Input
              label="Address (optional, max 400 chars)"
              placeholder="Your address"
              error={errors.address?.message}
              {...register('address')}
            />
            <Button type="submit" loading={isSubmitting} className="w-full">
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
