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

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

const EXTRACTION_PROMPT = `You are a booking confirmation data extractor. Analyze this image and extract structured booking information.

Determine the booking type and extract the relevant fields:

**Flight**: airline, flightNumber, departureAirport (3-letter code), arrivalAirport (3-letter code), date (format: "Mon DD, YYYY"), departureTime (format: "H:MM AM/PM"), arrivalTime (format: "H:MM AM/PM"), confirmationNumber
**Rental Car**: company, confirmationNumber, pickupLocation, pickupDate (format: "Mon DD, YYYY"), returnDate (format: "Mon DD, YYYY")
**Accommodation**: name, confirmationNumber, checkIn (format: "Mon DD, YYYY"), checkOut (format: "Mon DD, YYYY"), address, phone

Respond with ONLY valid JSON in this exact format:
{
  "type": "flight" | "rental" | "accommodation",
  ...extracted fields for that type...,
  "_uncertain": ["fieldName1", "fieldName2"]
}

The "_uncertain" array should list any field names where the text was blurry, partially obscured, or you had to guess. If all fields are clear, use an empty array.

If the image is not a booking confirmation, respond with:
{ "error": "This doesn't appear to be a booking confirmation." }`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
      max_tokens: 1024,
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
              text: EXTRACTION_PROMPT,
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
