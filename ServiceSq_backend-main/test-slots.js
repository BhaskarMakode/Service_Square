const dateStr = '2026-07-02';
const date = new Date(`${dateStr}T00:00:00`);
const durationMinutes = 60;
const slots = [];

const overlapsBooking = (s, e) => false;

const startHour = 0;
const startMinute = 0;
const endHour = 23;
const endMinute = 59;

let cursor = new Date(date);
cursor.setHours(startHour, startMinute, 0, 0);

const windowEnd = new Date(date);
windowEnd.setHours(endHour, endMinute, 0, 0);

while (cursor.getTime() + durationMinutes * 60000 <= windowEnd.getTime()) {
  const slotStart = new Date(cursor);
  const slotEnd = new Date(cursor.getTime() + durationMinutes * 60000);
  if (slotStart > new Date() && !overlapsBooking(slotStart, slotEnd)) {
    slots.push({
      start: slotStart.toISOString(),
      end: slotEnd.toISOString(),
      label: slotStart.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    });
  }
  cursor = new Date(cursor.getTime() + 30 * 60000);
}

console.log(slots.length);
if (slots.length > 0) console.log(slots[0]);
