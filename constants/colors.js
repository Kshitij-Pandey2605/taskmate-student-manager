// constants/colors.js
// Professional, student-friendly light theme color palette.
// Used across all screens and components to maintain visual consistency.

const colors = {
  // Brand colors
  primary: '#2563EB',        // Vibrant Royal Blue
  primaryDark: '#1D4ED8',    // Darker blue for active/hover states
  primaryLight: '#EFF6FF',   // Very soft blue tint for backgrounds and chips

  // Neutral layout colors
  background: '#F8FAFC',     // Clean soft slate background
  card: '#FFFFFF',           // Crisp white card surface
  cardBorder: '#E2E8F0',     // Subtle border line for cards and dividers
  inputBackground: '#F1F5F9',// Soft grey for text input fields

  // Typography colors
  textPrimary: '#0F172A',    // Dark slate for headings and primary content
  textSecondary: '#64748B',  // Slate grey for subheadings and body descriptions
  textMuted: '#94A3B8',      // Light slate for placeholders and inactive tabs
  textWhite: '#FFFFFF',      // White text for primary buttons and banners

  // Status & Alert colors
  success: '#16A34A',        // Green for completed tasks and success alerts
  successLight: '#DCFCE7',   // Light green background
  warning: '#D97706',        // Amber for medium priority and due soon
  warningLight: '#FEF3C7',   // Light amber background
  danger: '#DC2626',         // Red for overdue, high priority, and deletions
  dangerLight: '#FEE2E2',    // Light red background
  info: '#0284C7',           // Sky blue for general information
  infoLight: '#E0F2FE',      // Light sky blue background

  // Task Priority Colors (Text + Background)
  priority: {
    High: {
      text: '#DC2626',
      bg: '#FEE2E2',
      border: '#FCA5A5',
    },
    Medium: {
      text: '#D97706',
      bg: '#FEF3C7',
      border: '#FDE68A',
    },
    Low: {
      text: '#2563EB',
      bg: '#EFF6FF',
      border: '#BFDBFE',
    },
  },

  // Task Category Colors (Text + Background)
  category: {
    Assignment: {
      text: '#7C3AED',
      bg: '#EDE9FE',
      border: '#DDD6FE',
    },
    Exam: {
      text: '#E11D48',
      bg: '#FFE4E6',
      border: '#FECDD3',
    },
    Project: {
      text: '#0D9488',
      bg: '#CCFBF1',
      border: '#99F6E4',
    },
    Personal: {
      text: '#EA580C',
      bg: '#FFEDD5',
      border: '#FED7AA',
    },
    Other: {
      text: '#475569',
      bg: '#F1F5F9',
      border: '#E2E8F0',
    },
  },
};

export default colors;
