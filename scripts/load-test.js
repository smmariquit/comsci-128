import http from 'k6/http';
import { check, sleep } from 'k6';

// This script simulates a highly realistic load test using k6.
// It is designed to prove that the UPLB CASA infrastructure (Vercel + Supabase)
// can handle 5,000 concurrent users during peak registration periods.

export const options = {
  // Define the load stages
  stages: [
    { duration: '30s', target: 1000 }, // Ramp up to 1,000 users
    { duration: '1m', target: 5000 },  // Ramp up to 5,000 concurrent users
    { duration: '3m', target: 5000 },  // Hold steady at 5,000 users for 3 minutes
    { duration: '30s', target: 0 },    // Ramp down gracefully to 0 users
  ],
  // Define success criteria (this is great for the pitch!)
  thresholds: {
    // 99% of requests must complete in under 800ms
    http_req_duration: ['p(99)<800'],
    // 95% of requests must complete in under 400ms
    'http_req_duration{staticAsset:yes}': ['p(95)<400'],
    // Error rate must be less than 1%
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  // Replace with the actual deployed URL. DO NOT test localhost with 5000 users,
  // it will crash your own machine's network stack before the server even breaks.
  const BASE_URL = __ENV.TARGET_URL || 'https://uplb.casa';

  // 1. Simulate a user visiting the landing page
  const pageRes = http.get(BASE_URL);
  check(pageRes, {
    'landing page status 200': (r) => r.status === 200,
  });

  // 2. Simulate the user fetching the active housing accommodations (hits Supabase)
  // Assuming there is an endpoint or we hit the student browse route
  const apiRes = http.get(`${BASE_URL}/student/browse`);
  check(apiRes, {
    'browse page status 200': (r) => r.status === 200,
  });

  // Think time: real users take time to read the page
  sleep(Math.random() * 3 + 1); // Random sleep between 1-4 seconds
}
