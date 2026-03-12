import { z } from 'zod';

const bookingSchema = z.object({
  firstName: z.string().min(2),
  surname: z.string().min(2),
  email: z.string().email(),
  date: z.string().datetime(),
  time: z.string(),
  timezone: z.string(),
  timezoneLabel: z.string()
});
export {bookingSchema}