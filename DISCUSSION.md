# Implementation Notes

## Changes Made

- **Server-side Search**:  
  Replaced client-side filtering with server-side queries.

  - Added support for `?q`, `?limit`, and `?offset` URL parameters.
  - Updated `page.tsx` to fetch data from `/api/advocates` with these parameters.
  - Keeps the response shape `{ data }` consistent with the existing API.

- **Search Controls**:

  - Added a dedicated **Search** button (and Enter key support) to apply queries.
  - Added a **Reset** button to clear both the input and the URL.
  - Display the applied search term below the input for user feedback.

- **URL Synchronization**:

  - Search query and pagination state are now stored in the URL.
  - This allows refresh, back/forward navigation, and shareable links to preserve the search state.

- **Pagination-ready**:

  - Introduced `limit` (default 50) and `offset` query params.
  - Optional Prev/Next pagination buttons (currently commented out) show how results could be navigated in pages.

- **Phone Number Formatting**:

  - Added a helper function to format phone numbers as `XXX-XXX-XXXX` for consistent display.

- **Styling Enhancements**:
  - Used Tailwind component utilities (`btn`, `btn-primary`, `input`, `card`, `table`, etc.) for consistent dark-theme styling with minimal class duplication.

---

## If I Had More Time

- **Specialties Search**: Extend server-side search to support the `specialties` array column (requires Postgres array operators or trigram indexing).
- **Better Pagination UI**: Replace simple Prev/Next with infinite scroll or numbered pages, along with showing “1–50 of N results” using the `X-Total-Count` header.
- **Debounced Input**: Debounce the search input so that results update only after the user pauses typing, reducing unnecessary requests.
- **Loading & Error States**: Add skeleton loaders and error messages for better UX during fetches.
- **Accessibility Improvements**: Improve keyboard navigation, aria labels, and focus states for buttons and inputs.
- **Testing**: Add unit and integration tests for the search flow (ensuring queries hit the API, reset works, etc.).
- **Full-Text Search**: Upgrade to Postgres full-text search or trigram indexes for faster, more relevant matching on large datasets.

---
