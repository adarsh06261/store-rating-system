import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { changePasswordSchema } from '../../utils/validation';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function ChangePassword() {
  const { changePassword } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(changePasswordSchema) });

  const onSubmit = async (data) => {
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password changed successfully');
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    }
  };

  return (
    <div className="max-w-md">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Change Password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Current Password"
          type="password"
          error={errors.currentPassword?.message}
          {...register('currentPassword')}
        />
        <Input
          label="New Password"
          type="password"
          error={errors.newPassword?.message}
          {...register('newPassword')}
        />
        <Input
          label="Confirm New Password"
          type="password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
        <Button type="submit" loading={isSubmitting}>
          Update Password
        </Button>
      </form>
    </div>
  );
}
