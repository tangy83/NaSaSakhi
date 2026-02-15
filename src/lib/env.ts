/**
 * Environment utility module
 *
 * This module provides environment-related constants and utilities
 * that are evaluated at build time on the server side.
 */

/**
 * Indicates whether the application is running in development mode.
 * This is evaluated at build time on the server and is safe to use
 * in both Server and Client Components.
 *
 * @constant {boolean}
 */
export const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Indicates whether the application is running in production mode.
 *
 * @constant {boolean}
 */
export const isProduction = process.env.NODE_ENV === 'production';

/**
 * Indicates whether the application is running in test mode.
 *
 * @constant {boolean}
 */
export const isTest = process.env.NODE_ENV === 'test';
