export const environment = {
  // In real lifecycles, this file should not be part of version control
  production: false,
  // Server Base URL for Fake REST API
  // serverBaseURL: 'http://localhost:3000/api/v1'
  // Server Base URL for Spring Boot REST API
  // serverBaseURL: 'http://localhost:8080/api/v1'
  serverBaseUrl: 'http://localhost:3000/api/v1',

  reservationsOwnerEndpointPath: '/owner/reservations',
  reservationsUserEndpointPath: '/user/reservations',
  calendarOwnerEndpointPath: '/owner/calendar',
  calendarUserEndpointPath: '/user/calendar',
  roomlistEndpointPath: '/roomlist',
  alertsEndpointPath: '/alerts',
  historyOwnerEndpointPath: '/owner/history',
  historyUserEndpointPath: '/user/history',
  settingsOwnerEndpointPath: '/owner/settings',
  settingsUserEndpointPath: '/user/reservations',
};
