# loCATE! - Missing Persons Tracking System for Jamaica

A comprehensive web platform designed to help reunite families by tracking and locating missing persons across Jamaica. Built with modern web technologies and integrated with Supabase for real-time data management.

## Features

- **Missing Person Reports**: Submit detailed reports with photos and location data
- **Real-time Search**: Browse and filter missing person cases by parish, age, and other criteria
- **Interactive Map**: Visualize cases on a map with parish-based filtering
- **Anonymous Tips**: Submit information about missing persons anonymously or with contact details
- **Search Parties**: Organize and join community search efforts
- **AI Chatbot**: Get instant help navigating the platform
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices
- **Authentication**: Secure user registration and login with Supabase Auth

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **Maps**: Leaflet.js for interactive mapping
- **Hosting**: Vercel
- **Animations**: Custom CSS animations and transitions

## Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Supabase account (for backend services)
- Git (for version control)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/locate-jamaica.git
   cd locate-jamaica
   ```

2. **Configure Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Update `supabaseClient.js` with your credentials:
     ```javascript
     const SUPABASE_URL = "your-project-url";
     const SUPABASE_ANON_KEY = "your-anon-key";
     ```

3. **Set up the database**
   - Run the SQL schema provided in `database-schema.sql`
   - Create the following tables:
     - `users` - User profiles
     - `cases` - Missing person cases
     - `tips` - Anonymous tips
     - `search_parties` - Search party events

4. **Run locally**
   ```bash
   # Using Python 3
   python -m http.server 8000

   # Or using Node.js http-server
   npx http-server -p 8000
   ```

5. **Open in browser**
   Navigate to `http://localhost:8000`

## Deployment to Vercel

### Option 1: Deploy with Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Deploy to production**
   ```bash
   vercel --prod
   ```

### Option 2: Deploy with GitHub

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/locate-jamaica.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Click "Deploy"

3. **Configure Environment Variables** (if needed)
   - Add any API keys or sensitive data as environment variables in Vercel dashboard

## Database Schema

### Tables Required

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  parish TEXT,
  address TEXT,
  notify_opt_in BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Cases table
CREATE TABLE cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL,
  photo_url TEXT,
  description TEXT,
  last_known_clothing TEXT,
  last_seen_date DATE NOT NULL,
  last_seen_time TIME,
  last_seen_address TEXT NOT NULL,
  parish TEXT NOT NULL,
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  reporter_name TEXT NOT NULL,
  reporter_contact TEXT NOT NULL,
  reporter_email TEXT,
  relationship TEXT NOT NULL,
  police_report_number TEXT,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tips table
CREATE TABLE tips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID REFERENCES cases(id),
  tip_text TEXT NOT NULL,
  contact_name TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  anonymous BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Search Parties table
CREATE TABLE search_parties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID REFERENCES cases(id),
  organizer_name TEXT NOT NULL,
  organizer_contact TEXT NOT NULL,
  meeting_point TEXT NOT NULL,
  parish TEXT NOT NULL,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  description TEXT,
  max_volunteers INTEGER,
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Storage Buckets

Create a storage bucket named `photos` in Supabase for case images.

## Project Structure

```
locate-jamaica/
├── index.html              # Login/Registration page
├── home.html               # Dashboard/Home page
├── missingPersons.html     # Browse missing persons
├── report.html             # Report missing person
├── caseDetail.html         # Individual case details
├── submit-tip.html         # Submit tips
├── search-parties.html     # Search party management
├── about.html              # About page
├── admin.html              # Admin dashboard
├── register.html           # Registration page
├── supabaseClient.js       # Supabase configuration
├── dbUtils.js              # Database utility functions
├── chatbot.js              # AI chatbot component
├── styles.css              # Global styles and animations
├── vercel.json             # Vercel deployment config
├── package.json            # Project metadata
└── README.md               # This file
```

## Features in Detail

### 1. Report Missing Person
- Upload photos (max 5MB)
- Pinpoint location on interactive map
- Provide detailed descriptions
- Track report status

### 2. Search & Filter
- Filter by parish
- Sort by date, age
- Real-time search
- Map and list views

### 3. Submit Tips
- Anonymous or identified submissions
- Attach photos or documents
- Direct messaging to reporters

### 4. Search Parties
- Create and join search efforts
- Real-time participant tracking
- Location-based coordination

### 5. AI Chatbot
- Instant help and guidance
- Quick actions menu
- 24/7 availability
- Mock data with API-ready structure

## Customization

### Update Branding
Edit CSS variables in `styles.css`:
```css
:root {
    --primary: #E65C2A;
    --secondary: #0C243C;
    /* Add your colors */
}
```

### Add API Keys
For future API integrations (e.g., OpenAI for chatbot):
```javascript
// In chatbot.js
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Security

- Never commit sensitive data (API keys, passwords)
- Use environment variables for secrets
- Enable Row Level Security (RLS) in Supabase
- Sanitize user inputs
- Implement CAPTCHA for forms (recommended)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Jamaica Constabulary Force
- Crime Stop Jamaica
- Community volunteers
- Open source contributors

## Support

For support, email support@locate.com or open an issue on GitHub.

## Roadmap

- [ ] SMS notifications
- [ ] Mobile app (React Native)
- [ ] AI-powered facial recognition
- [ ] Multi-language support
- [ ] Integration with law enforcement databases
- [ ] Advanced analytics dashboard

---

**Built with ❤️ for Jamaica**
