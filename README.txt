Gramin Vehicle Booking - Simple Frontend (ZIP)
----------------------------------------------
Files:
- index.html           : Home page (Hero + CTA)
- vehicles.html        : Vehicle listing with WhatsApp links
- booking.html         : Booking form (Save to localStorage + send to WhatsApp)
- booking-table.html   : View saved bookings (reads from localStorage)
- styles.css           : Main styles
- script.js            : Form handling, localStorage, WhatsApp integration
- README.txt           : This file

How to use:
1. Unzip and upload all files to your web hosting / cPanel / Netlify / GitHub Pages root.
2. Edit 'script.js' and replace the placeholder WhatsApp phone number '91XXXXXXXXXX' with your real phone number.
   Example: var phone = '919812345678'
3. Open index.html in browser to check.
4. Bookings are saved locally in the browser using localStorage. For server-side saving, you will need backend/API.

Notes:
- Images are hotlinked from public URLs. Replace with your own images if you want.
- This is a frontend-only starter. For multi-user central storage, integrate a backend or Google Sheets API.
