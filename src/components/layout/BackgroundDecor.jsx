/* Copyright (c) UWorx Services 2026. All Rights Reserved. The information contained herein is proprietary and confidential. This proprietary and confidential information, either in whole or in part, shall not be used for any purpose unless permitted by the terms of a valid license agreement. */
import React from 'react';

function BackgroundDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <svg
        className="absolute -top-24 left-[8%] h-[520px] w-[520px] opacity-[0.35] dark:opacity-[0.22]"
        viewBox="0 0 520 520"
        fill="none"
      >
        <circle cx="260" cy="260" r="259" stroke="url(#ring-a)" strokeWidth="1" />
      </svg>
      <svg
        className="absolute -right-16 top-16 h-[380px] w-[380px] opacity-[0.3] dark:opacity-[0.18]"
        viewBox="0 0 380 380"
        fill="none"
      >
        <circle cx="190" cy="190" r="189" stroke="url(#ring-b)" strokeWidth="1" />
      </svg>
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1440 300" fill="none" preserveAspectRatio="none">
        <path
          d="M-40 60 C 240 160, 520 -20, 800 90 S 1360 160, 1480 40"
          stroke="url(#line-a)"
          strokeWidth="1"
          className="opacity-[0.28] dark:opacity-[0.16]"
        />
      </svg>
      <svg width="0" height="0">
        <defs>
          <linearGradient id="ring-a" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="ring-b" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C4B5FD" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#C4B5FD" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="line-a" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0" />
            <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export default BackgroundDecor;