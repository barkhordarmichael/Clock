import { useEffect, useRef, useState } from 'react';
import { MovementType } from '../types';
import { playClockTick, playHourlyGong } from '../utils/audio';

export interface TimeState {
  date: Date;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
  hoursDeg: number;
  minutesDeg: number;
  secondsDeg: number;
  dayName: string;
  monthName: string;
  dateNum: number;
  isPm: boolean;
}

export function useCurrentTime(
  movement: MovementType,
  tickSound: boolean,
  volume: number,
  hourlyChime: boolean,
) {
  const [timeState, setTimeState] = useState<TimeState>(() => calculateTimeState(new Date(), movement));
  const lastSecondRef = useRef<number>(-1);
  const lastHourRef = useRef<number>(-1);
  const soundSettingsRef = useRef({ tickSound, volume, hourlyChime });

  soundSettingsRef.current = { tickSound, volume, hourlyChime };

  useEffect(() => {
    let animFrameId: number;
    let timerId: ReturnType<typeof setTimeout> | ReturnType<typeof setInterval>;

    const tick = () => {
      const now = new Date();
      const currentSec = now.getSeconds();
      const currentMin = now.getMinutes();
      const currentHour = now.getHours();

      // Check if second changed for audio tick
      if (currentSec !== lastSecondRef.current) {
        lastSecondRef.current = currentSec;

        if (soundSettingsRef.current.tickSound) {
          const isTock = currentSec % 2 === 1;
          playClockTick(isTock, soundSettingsRef.current.volume);
        }

        // Check for top-of-the-hour chime
        if (soundSettingsRef.current.hourlyChime && currentMin === 0 && currentSec === 0) {
          if (lastHourRef.current !== currentHour) {
            lastHourRef.current = currentHour;
            playHourlyGong(soundSettingsRef.current.volume);
          }
        }
      }

      setTimeState(calculateTimeState(now, movement));

      if (movement === 'sweep') {
        animFrameId = requestAnimationFrame(tick);
      }
    };

    if (movement === 'sweep') {
      animFrameId = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(animFrameId);
    } else {
      // Discrete step mode: align to the next second boundary
      tick();
      const now = new Date();
      const msUntilNextSec = 1000 - now.getMilliseconds();

      timerId = setTimeout(() => {
        tick();
        const intervalId = setInterval(tick, 1000);
        timerId = intervalId;
      }, msUntilNextSec);

      return () => {
        clearTimeout(timerId);
        clearInterval(timerId);
      };
    }
  }, [movement]);

  return timeState;
}

function calculateTimeState(date: Date, movement: MovementType): TimeState {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const milliseconds = date.getMilliseconds();

  let secondsDeg: number;
  let minutesDeg: number;
  let hoursDeg: number;

  if (movement === 'sweep') {
    const fractionalSeconds = seconds + milliseconds / 1000;
    secondsDeg = fractionalSeconds * 6;
    const fractionalMinutes = minutes + fractionalSeconds / 60;
    minutesDeg = fractionalMinutes * 6;
    hoursDeg = ((hours % 12) + fractionalMinutes / 60) * 30;
  } else {
    secondsDeg = seconds * 6;
    minutesDeg = (minutes + seconds / 60) * 6;
    hoursDeg = ((hours % 12) + minutes / 60) * 30;
  }

  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  return {
    date,
    hours,
    minutes,
    seconds,
    milliseconds,
    hoursDeg,
    minutesDeg,
    secondsDeg,
    dayName: dayNames[date.getDay()],
    monthName: monthNames[date.getMonth()],
    dateNum: date.getDate(),
    isPm: hours >= 12,
  };
}
