/**
 * Lila Trips — Booking Extraction API Route
 *
 * Vercel serverless function.
 * File location: /api/extract-booking.js
 *
 * POST /api/extract-booking
 * Body: { base64Image, mimeType }
 *
 * Uses Claude vision to extract structured booking data from
 * confirmation screenshots (flights, hotels, rental cars).
 */

import Anthropic from '@anthropic-ai/sdk';
import { checkOrigin, checkRateLimit } from './_utils.js';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

const SYSTEM_PROMPT = `You are a precision booking confirmation data extractor. Your job is to carefully analyze screenshots of travel confirmations and extract every relevant detail into structured JSON.

IMPORTANT EXTRACTION PRIORITIES — look carefully for ALL of these:
- Airport codes (3-letter IATA codes like LAX, JFK, SFO — often near city names)
- Flight numbers (e.g. UA 1234, DL 567, AA 890)
- Dates and times (check headers, sidebars, and fine print)
- Confirmation/record locator codes (usually 6 alphanumeric characters)
- Departure and arrival cities/airports

FIELD DEFINITIONS BY BOOKING TYPE:

**Flight**:
- airline: Full airline name (e.g. "United Airlines", "Delta Air Lines")
- flightNumber: Carrier code + number (e.g. "UA 1234")
- departureAirport: 3-letter IATA code (e.g. "LAX"). If only city name is visible, use the primary airport code.
- arrivalAirport: 3-letter IATA code (e.g. "JFK"). If only city name is visible, use the primary airport code.
- date: Format "Mon DD, YYYY" (e.g. "Mar 15, 2026")
- departureTime: Format "H:MM AM/PM" (e.g. "8:30 AM")
- arrivalTime: Format "H:MM AM/PM" (e.g. "4:45 PM")
- confirmationNumber: The booking reference / record locator

**Rental Car**:
- company, confirmationNumber, pickupLocation
- pickupDate: Format "Mon DD, YYYY"
- returnDate: Format "Mon DD, YYYY"

**Accommodation**:
- name, confirmationNumber
- checkIn: Format "Mon DD, YYYY"
- checkOut: Format "Mon DD, YYYY"
- address, phone

**Reservation** (restaurant, spa, tour, activity, class, or any other booking):
- name: Business or venue name (e.g. "Refuge Spa", "King's Landing Bistro")
- type: Category (e.g. "Spa", "Dinner", "Guided Tour", "Yoga Class")
- date: Format "Mon DD, YYYY"
- time: Format "H:MM AM/PM"
- confirmationNumber: Booking reference if visible
- location: Full address if visible
- notes: Any special instructions, party size, or relevant details

RESPONSE FORMAT — respond with ONLY valid JSON, no other text:
{
  "type": "flight" | "rental" | "accommodation" | "reservation",
  ...extracted fields for that type...,
  "_uncertain": ["fieldName1", "fieldName2"]
}

The "_uncertain" array should list any field names where the value was blurry, partially obscured, or you had to infer. If all fields are clear, use an empty array.

EXAMPLES:

Flight confirmation screenshot →
{"type":"flight","airline":"United Airlines","flightNumber":"UA 2381","departureAirport":"SFO","arrivalAirport":"LAX","date":"Apr 12, 2026","departureTime":"7:15 AM","arrivalTime":"8:50 AM","confirmationNumber":"ABC123","_uncertain":[]}

Hotel confirmation screenshot →
{"type":"accommodation","name":"The Ritz-Carlton","confirmationNumber":"92841556","checkIn":"Apr 12, 2026","checkOut":"Apr 15, 2026","address":"1 Ritz-Carlton Dr, Dana Point, CA 92629","phone":"(949) 240-2000","_uncertain":["phone"]}

Spa/restaurant/activity confirmation screenshot →
{"type":"reservation","name":"Refuge Spa","type":"Spa","date":"Apr 07, 2026","time":"3:00 PM","confirmationNumber":"","location":"27300 Rancho San Carlos Rd, Carmel, CA","notes":"Lisa Koch, Spa Admission Online","_uncertain":[]}

If the image is not a booking confirmation, respond with:
{"error":"This doesn't appear to be a booking confirmation."}`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!checkOrigin(req, res)) return;
  if (!checkRateLimit(req, res, 'extract-booking')) return;

  try {
    const { base64Image, mimeType } = req.body;

    if (!base64Image || !mimeType) {
      return res.status(400).json({ error: 'Missing required fields: base64Image, mimeType' });
    }

    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      return res.status(400).json({ error: `Unsupported image type. Allowed: ${ALLOWED_MIME_TYPES.join(', ')}` });
    }

    // Check approximate size (base64 is ~4/3 of original)
    const approxBytes = (base64Image.length * 3) / 4;
    if (approxBytes > MAX_SIZE_BYTES) {
      return res.status(400).json({ error: 'Image exceeds 5MB limit.' });
    }

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mimeType,
                data: base64Image,
              },
            },
            {
              type: 'text',
              text: 'Extract all booking details from this confirmation screenshot. Look carefully for airport codes, flight numbers, dates, times, and confirmation numbers.',
            },
          ],
        },
      ],
    });

    const text = response.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('');

    // Parse the JSON response
    let booking;
    try {
      const firstBrace = text.indexOf('{');
      const lastBrace = text.lastIndexOf('}');
      if (firstBrace === -1 || lastBrace === -1) throw new Error('No JSON found');
      booking = JSON.parse(text.slice(firstBrace, lastBrace + 1));
    } catch {
      return res.status(422).json({ error: 'Could not extract booking data from this image.' });
    }

    if (booking.error) {
      return res.status(422).json({ error: booking.error });
    }

    return res.status(200).json({ success: true, booking });

  } catch (error) {
    console.error('Booking extraction failed:', error);
    return res.status(500).json({
      error: 'Something went wrong extracting booking data. Please try again.',
    });
  }
}
