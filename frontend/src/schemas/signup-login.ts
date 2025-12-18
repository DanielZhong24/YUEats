import * as z from 'zod'

export const customerCourierSchema = z
  .object({
    firstName: z
      .string()
      .min(1, 'First name is required!')
      .max(50, 'First name must be at most 50 characters!')
      .refine(
        (firstName) => /^[a-zA-Z\s'-]+$/.test(firstName),
        'First name contains invalid characters!',
      ),
    lastName: z
      .string()
      .min(1, 'Last name is required!')
      .max(50, 'Last name must be at most 50 characters!')
      .refine(
        (lastName) => /^[a-zA-Z\s'-]+$/.test(lastName),
        'Last name contains invalid characters!',
      ),
    businessName: z.string().optional(),
    email: z.email('Please enter a valid email address!'),
    phoneNumber: z
      .string()
      .refine(
        (phoneNumber) =>
          /^[0-9]{3}[-\s]?[0-9]{3}[-\s]?[0-9]{4}$/.test(phoneNumber),
        'Please enter a valid phone number!',
      ),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters!')
      .max(20, 'Password must be at most 20 characters!')
      .refine(
        (password) => /[A-Z]/.test(password),
        'Password must contain at least one uppercase letter!',
      )
      .refine(
        (password) => /[a-z]/.test(password),
        'Password must contain at least one lowercase letter!',
      )
      .refine(
        (password) => /[0-9]/.test(password),
        'Password must contain at least one number!',
      )
      .refine(
        (password) => /[!@#$%^&*]/.test(password),
        'Password must contain at least one special character!',
      ),
    passwordConfirm: z.string().min(8, 'Please confirm your password!'),
  })
  .refine((data) => data.password == data.passwordConfirm, {
    error: 'Passwords do not match!',
    path: ['passwordConfirm'],
  })

export const vendorSchema = z
  .object({
    firstName: z
      .string()
      .min(1, 'First name is required!')
      .max(50, 'First name must be at most 50 characters!')
      .refine(
        (firstName) => /^[a-zA-Z\s'-]+$/.test(firstName),
        'First name contains invalid characters!',
      ),
    lastName: z
      .string()
      .min(1, 'Last name is required!')
      .max(50, 'Last name must be at most 50 characters!')
      .refine(
        (lastName) => /^[a-zA-Z\s'-]+$/.test(lastName),
        'Last name contains invalid characters!',
      ),
    businessName: z
      .string()
      .min(3, 'Business name must be at least 3 characters!')
      .max(100, 'Business name must be at most 100 characters!')
      .refine(
        (name) => /^[a-zA-Z0-9\s&'-]+$/.test(name),
        'Business name contains invalid characters!',
      ),
    email: z.email('Please enter a valid email address!'),
    phoneNumber: z
      .string()
      .refine(
        (phoneNumber) =>
          /^[0-9]{3}[-\s]?[0-9]{3}[-\s]?[0-9]{4}$/.test(phoneNumber),
        'Please enter a valid phone number!',
      ),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters!')
      .max(20, 'Password must be at most 20 characters!')
      .refine(
        (password) => /[A-Z]/.test(password),
        'Password must contain at least one uppercase letter!',
      )
      .refine(
        (password) => /[a-z]/.test(password),
        'Password must contain at least one lowercase letter!',
      )
      .refine(
        (password) => /[0-9]/.test(password),
        'Password must contain at least one number!',
      )
      .refine(
        (password) => /[!@#$%^&*]/.test(password),
        'Password must contain at least one special character!',
      ),
    passwordConfirm: z.string().min(8, 'Please confirm your password!'),
  })
  .refine((data) => data.password == data.passwordConfirm, {
    error: 'Passwords do not match!',
    path: ['passwordConfirm'],
  })

export const loginSchema = z.object({
  email: z.email('Please enter a valid email address!'),
  password: z.string().min(1, 'Password is required!'),
})
