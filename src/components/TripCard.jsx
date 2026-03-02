// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT: TripCard — shared card for group/threshold trips
// ═══════════════════════════════════════════════════════════════════════════════
//
// "Functional Elegant" style: white card, accent bar top, all info visible,
// consistent height across a grid row.
//
// Usage:
//   import TripCard from '@components/TripCard';
//   import { trips } from '@data/trips';
//
//   <TripCard trip={trips[0]} />
//
// ═══════════════════════════════════════════════════════════════════════════════

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { C } from '@data/brand';
import { trackEvent } from '@utils/analytics';

export default function TripCard({ trip, delay = 0 }) {
  const [hover, setHover] = useState(false);

  return (
    <Link
      to={`/trips/${trip.slug}`}
      style={{ textDecoration: "none", display: "block", height: "100%" }}
      onClick={() => trackEvent('trip_card_clicked', { trip_slug: trip.slug })}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={{
        background: "white",
        overflow: "hidden",
        transition: "transform 0.4s ease, box-shadow 0.4s ease",
        transform: hover ? "translateY(-3px)" : "none",
        boxShadow: hover ? "0 8px 32px rgba(0,0,0,0.07)" : "0 1px 8px rgba(0,0,0,0.03)",
        borderTop: `2px solid ${trip.color}`,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}>
        {/* Image area */}
        <div style={{
          height: 220,
          background: trip.photo
            ? `url(${trip.photo}) center/cover no-repeat`
            : `linear-gradient(135deg, ${trip.color}12 0%, ${C.stone}18 100%)`,
          position: "relative",
          overflow: "hidden",
          flexShrink: 0,
        }}>
          {/* Placeholder geometry (only if no photo) */}
          {!trip.photo && (
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{
                width: 56, height: 56,
                border: `1px solid ${trip.color}35`,
                borderRadius: "50%",
              }} />
              <div style={{
                position: "absolute",
                width: 32, height: 32,
                border: `1px solid ${trip.color}25`,
                transform: "rotate(45deg)",
              }} />
            </div>
          )}

          {/* Season + Duration badges */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            display: "flex", justifyContent: "space-between",
            padding: "0 20px 14px",
          }}>
            <span style={{
              fontFamily: "'Quicksand', sans-serif",
              fontSize: 9, fontWeight: 700,
              letterSpacing: "0.2em", textTransform: "uppercase",
              color: trip.color,
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(8px)",
              padding: "4px 10px",
            }}>
              {trip.season}
            </span>
            <span style={{
              fontFamily: "'Quicksand', sans-serif",
              fontSize: 9, fontWeight: 600,
              letterSpacing: "0.15em", textTransform: "uppercase",
              color: "#7a8a96",
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(8px)",
              padding: "4px 10px",
            }}>
              {trip.duration}
            </span>
          </div>

          {/* Tag badge (e.g. "Next Departure") */}
          {trip.tag && (
            <div style={{
              position: "absolute", top: 14, left: 14,
              fontFamily: "'Quicksand', sans-serif",
              fontSize: 9, fontWeight: 700,
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: C.darkInk,
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(8px)",
              padding: "5px 12px",
            }}>
              {trip.tag}
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{
          padding: "24px 24px 28px",
          display: "flex", flexDirection: "column",
          flex: 1,
        }}>
          <span style={{
            fontFamily: "'Quicksand', sans-serif",
            fontSize: 10, fontWeight: 700,
            letterSpacing: "0.2em", textTransform: "uppercase",
            color: trip.color, display: "block", marginBottom: 8,
          }}>
            {trip.location}{trip.region ? `, ${trip.region}` : ""}
          </span>

          <h3 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 24, fontWeight: 400,
            color: C.darkInk, margin: "0 0 10px", lineHeight: 1.2,
          }}>
            {trip.title}
          </h3>

          {/* Description — fixed 3-line height for consistency */}
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 14, fontStyle: "italic",
            color: "#5a6a78", lineHeight: 1.7,
            margin: "0 0 20px",
            flex: 1,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}>
            {trip.description}
          </p>

          {/* Bottom row — always anchored to bottom */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            paddingTop: 16,
            borderTop: `1px solid ${C.stone}`,
            marginTop: "auto",
          }}>
            <div>
              <div style={{
                fontFamily: "'Quicksand', sans-serif",
                fontSize: 11, color: "#7a8a96", marginBottom: 2,
              }}>
                {trip.dates}
              </div>
              {trip.spots && (
                <div style={{
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: 10, fontWeight: 600,
                  color: C.oceanTeal || "#5a9e8f",
                }}>
                  {trip.spots}
                </div>
              )}
            </div>
            <div style={{
              fontFamily: "'Quicksand', sans-serif",
              fontSize: 18, fontWeight: 500,
              color: C.darkInk,
              letterSpacing: "0.02em",
            }}>
              {trip.price}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
