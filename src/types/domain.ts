import type { Tables, Enums } from './database'

export type Profile = Tables<'profiles'>
export type Concert = Tables<'concerts'>
export type Artist = Tables<'artists'>
export type Venue = Tables<'venues'>
export type Tour = Tables<'tours'>
export type SetlistSong = Tables<'setlist_songs'>
export type Achievement = Tables<'achievements'>
export type Notification = Tables<'notifications'>

export type ConcertType = Enums<'concert_type'>
export type ConcertStatus = Enums<'concert_status'>
export type TicketType = Enums<'ticket_type'>
export type ArtistRole = Enums<'artist_role'>
export type PressType = Enums<'press_type'>
export type VenueType = Enums<'venue_type'>
export type BuddyStatus = Enums<'buddy_status'>
export type FriendshipStatus = Enums<'friendship_status'>
export type AchievementRarity = Enums<'achievement_rarity'>
