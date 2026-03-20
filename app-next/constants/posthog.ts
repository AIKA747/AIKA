import PostHog from 'posthog-react-native';

export const posthog = new PostHog('phc_T6HH9WUuelaihnY5WnpWSSEXbO5aOr28Y2O6Nx6sDxP', {
  host: 'https://us.i.posthog.com',
  flushAt: 1,
  enableSessionReplay: true,
  captureAppLifecycleEvents: true,
  errorTracking: {
    autocapture: {
      uncaughtExceptions: true,
      unhandledRejections: true,
      console: ['error', 'warn'],
    },
  },

  // if using WebView, you have to disable masking for text inputs and images
  // sessionReplayConfig: {
  //   maskAllTextInputs: false,
  //   maskAllImages: false,
  // },
});

posthog.debug(true);
