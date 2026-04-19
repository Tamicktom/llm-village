//* Libraries imports
import z from 'zod'

//* Environment variables schema
const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
})

//* Environment variables
export const env = envSchema.parse(process.env);