import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const usePasswordForm = () => {
  const { 
    register, 
    handleSubmit, 
    reset, 
    watch, 
    formState: { errors },
    setError
  } = useForm<PasswordChangeData>({
    mode: 'onChange'
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const togglePasswordVisibility = useCallback((field: keyof typeof showPassword) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  }, []);

  const newPassword = watch('newPassword') || '';
  const passwordRequirements = {
    length: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /\d/.test(newPassword),
    special: /[@$!%*?&]/.test(newPassword)
  };

  const allRequirementsMet = 
    passwordRequirements.length && 
    passwordRequirements.uppercase &&
    passwordRequirements.lowercase &&
    passwordRequirements.number &&
    passwordRequirements.special;

  return {
    register,
    handleSubmit,
    reset,
    watch,
    errors,
    setError,
    showPassword,
    togglePasswordVisibility,
    passwordRequirements,
    allRequirementsMet
  };
};