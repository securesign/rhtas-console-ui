import { expect } from 'vitest'
import * as matchers from '@testing-library/jest-dom/matchers'

// // Add jest-dom matchers to Vitest's expect
expect.extend(matchers)
