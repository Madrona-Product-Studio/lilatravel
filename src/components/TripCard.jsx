// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT: TripCard — shared card for group/threshold trips
// ═══════════════════════════════════════════════════════════════════════════════

import { C } from '@data/brand';

export default function TripCard({ trip, delay = 0 }) {
  return (
    <div className="no-underline block h-full cursor-default">
      <div
        className="bg-white overflow-hidden transition-[transform,box-shadow] duration-400 ease-out shadow-[0_1px_8px_rgba(0,0,0,0.03)] h-full flex flex-col"
        style={{ borderTop: `2px solid ${trip.color}` }}
      >
        {/* Image area */}
        <div
          className="h-[220px] relative overflow-hidden shrink-0"
          style={{
            background: trip.photo
              ? `url(${trip.photo}) center/cover no-repeat`
              : `linear-gradient(135deg, ${trip.color}30 0%, ${trip.color}15 50%, ${C.stone}35 100%)`,
          }}
        >
          {/* Placeholder geometry (only if no photo) */}
          {!trip.photo && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-14 h-14 rounded-full"
                style={{ border: `1.5px solid ${trip.color}50` }}
              />
              <div
                className="absolute w-8 h-8 rotate-45"
                style={{ border: `1.5px solid ${trip.color}40` }}
              />
            </div>
          )}

          {/* Season + Duration badges */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-5 pb-3.5">
            <span
              className="font-body text-[10px] font-bold tracking-[0.2em] uppercase backdrop-blur-[8px] bg-white/[0.92] px-2.5 py-1"
              style={{ color: trip.color }}
            >
              {trip.season}
            </span>
            <span className="font-body text-[10px] font-semibold tracking-[0.15em] uppercase text-[#7a8a96] backdrop-blur-[8px] bg-white/[0.92] px-2.5 py-1">
              {trip.duration}
            </span>
          </div>

          {/* Tag badge (e.g. "Next Departure") */}
          {trip.tag && (
            <div className="absolute top-3.5 left-3.5 font-body text-[10px] font-bold tracking-[0.18em] uppercase text-dark-ink backdrop-blur-[8px] bg-white/[0.92] px-3 py-[5px]">
              {trip.tag}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-6 pt-6 pb-7 flex flex-col flex-1">
          <span
            className="font-body text-[11px] font-bold tracking-[0.2em] uppercase block mb-2"
            style={{ color: trip.color }}
          >
            {trip.location}{trip.region ? `, ${trip.region}` : ""}
          </span>

          <h3 className="font-serif text-2xl font-normal text-dark-ink m-0 mb-2.5 leading-[1.2]">
            {trip.title}
          </h3>

          {/* Description — fixed 3-line height for consistency */}
          <p className="font-serif text-sm text-[#5a6a78] leading-[1.7] m-0 mb-5 flex-1 line-clamp-3">
            {trip.description}
          </p>

          {/* Bottom row — always anchored to bottom */}
          <div className="flex justify-between items-center pt-4 border-t border-stone mt-auto">
            <div>
              <div className="font-body text-xs text-[#7a8a96] mb-0.5">
                {trip.dates}
              </div>
              {trip.spots && (
                <div className="font-body text-[11px] font-semibold text-ocean-teal">
                  {trip.spots}
                </div>
              )}
            </div>
            <div className="font-body text-lg font-medium text-dark-ink tracking-[0.02em]">
              {trip.price}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
