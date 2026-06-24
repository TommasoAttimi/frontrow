import { z } from 'zod'

export const artistRefSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
})

export const venueRefSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().min(1),
    city: z.string().optional(),
    country: z.string().optional(),
    country_name: z.string().optional(),
  })
  .refine((v) => !!v.id || (!!v.city && !!v.country), {
    message: 'City and country are required for a new venue',
  })

export const supportSchema = z.object({
  artist: artistRefSchema,
  role: z.enum(['support', 'special_guest', 'opener']),
})

export const concertFormSchema = z
  .object({
    type: z.enum(['concert', 'festival']),
    status: z.enum(['attended', 'planned', 'wishlist']),
    date: z.string().min(1, 'Pick a date'),
    headliner: artistRefSchema.nullable(),
    supports: z.array(supportSchema),
    venue: venueRefSchema.nullable(),
    festival_name: z.string().optional(),
    tour_name: z.string().optional(),
    ticket_type: z.string().optional(),
    ticket_price_paid: z.string().optional(),
    ticket_currency: z.string().optional(),
    personal_note: z.string().optional(),
    is_accredited: z.boolean(),
    accred_type: z.string().optional(),
    accred_client: z.string().optional(),
    accred_photo_pit: z.boolean().optional(),
    accred_first_3_songs: z.boolean().optional(),
  })
  .superRefine((val, ctx) => {
    if (!val.headliner) {
      ctx.addIssue({ code: 'custom', path: ['headliner'], message: 'Add the headliner' })
    }
    if (!val.venue) {
      ctx.addIssue({ code: 'custom', path: ['venue'], message: 'Add the venue' })
    }
  })

export type ArtistRef = z.infer<typeof artistRefSchema>
export type VenueRef = z.infer<typeof venueRefSchema>
export type SupportAct = z.infer<typeof supportSchema>
export type ConcertFormValues = z.infer<typeof concertFormSchema>
