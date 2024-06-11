import { URL_REGEX } from '@/constants/constants'
import { z } from 'zod' // Add new import

export const ClientSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email({
      message: 'Email is required',
    }),
  name: z.string({
    required_error: 'Name is required',
  }),
  website_url: z
    .string()
    .optional()
    .refine((value): value is string => typeof value === 'string' && (value === '' || URL_REGEX.test(value)), {
      message: 'Valid URL required',
    }),
  contact: z.string().optional(),
  sp_system_ids: z.string(),
})

export const ClientSchema1 = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email({
      message: 'Email is required',
    }),
  // name: z.string({
  //   required_error: 'Name is required',
  // }),
  name: z.string().min(1, { message: 'Name is required' }),
  contact: z.string().optional(),
  // sp_system_ids: z.string(),
  website_url: z
    .string()
    .optional()
    .refine((value): value is string => typeof value === 'string' && (value === '' || URL_REGEX.test(value)), {
      message: 'Valid URL required',
    }),
})
