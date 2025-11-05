# Algerian Luminaries

Developed by **abdevs**.

## Project Overview

**Algerian Luminaries** is a modern, responsive, and multilingual (French, English, and Arabic) web application dedicated to showcasing eminent Algerian personalities across various fields like arts, science, politics, and more. It provides an interactive and educational platform for users to discover the men and women who have shaped Algeria.

## Key Features & Pages

The application is built with a rich set of features and well-defined pages to ensure a seamless user experience.

### 1. Main Gallery Page (`/`)
- **Responsive Grid:** Displays personalities in a visually appealing card layout that adapts to all screen sizes.
- **Pagination:** Efficiently handles a large number of entries with easy-to-use pagination controls.
- **Advanced Filtering:** Users can filter the personalities by:
    - Domain (e.g., Music, Literature, Politics)
    - Birth Year
    - Death Year
    - Status (Alive/Deceased)
    - Gender

### 2. Personality Detail Page (`/#/personality/:id`)
- **In-Depth Information:** Provides a comprehensive view of each personality, including:
    - A detailed biography.
    - Key information like birth/death dates and places.
    - A list of notable works and awards.
    - Clickable links to related personalities (e.g., collaborators, family).
    - A media gallery with images and videos.
    - External links for further reading.
- **AI-Powered Summary:** Features a "Generate AI Summary" button that uses the **Google Gemini API** to create a concise, one-paragraph summary of the personality's biography in the user's selected language.
- **Interactive Rating System:** Allows users to rate personalities.

### 3. Admin Panel (`/#/admin`)
- **Secure Access:** Protected by a login page (`/#/login`) with credentials (`admin`/`admin123`).
- **Full CRUD Functionality:** Administrators can:
    - **Create:** Add new personalities through a comprehensive form.
    - **Read:** View and search for all existing personalities.
    - **Update:** Edit the details of any personality.
    - **Delete:** Remove personalities from the database.
- **Advanced Form:** The creation/editing form is multilingual and includes real-time validation to ensure data integrity.

### 4. Legal & Compliance Pages
- **Privacy Policy (`/#/privacy`):** A dedicated page outlining the website's data handling and privacy practices.
- **Legal Notice (`/#/legal`):** Provides essential legal information, copyright details, and contact information.
- **Cookie Consent Banner:** A non-intrusive banner informs users about cookie usage and requests consent, which is stored locally to enhance the user experience on subsequent visits.

### 5. Shared Components
- **Header:** Contains the site title and a language switcher for seamless transition between French, English, and Arabic. It also shows a "Logout" button for authenticated admins.
- **Footer:** Includes links to the legal pages, an admin panel link, and a functional newsletter subscription form.
