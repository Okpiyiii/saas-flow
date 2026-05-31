const isProd = import.meta.env.PROD;

export function logError(context: string, err: unknown) {
  if (isProd) {
    console.error(`[${context}] An error occurred.`);
  } else {
    console.error(`[${context}]`, err);
  }
}
