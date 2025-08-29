# André Filipe de Moraes Goulart - Portfolio

A modern, responsive portfolio website for André Filipe de Moraes Goulart, Senior Software Engineer, built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.

## 🚀 Features

- **Modern Design**: Clean and professional layout with smooth animations
- **Responsive**: Optimized for all device sizes
- **International**: Support for English and Portuguese (PT-BR)
- **Parallax Effects**: Smooth scrolling with parallax animations
- **Interactive Components**: Hover effects and smooth transitions
- **Dark Theme**: Beautiful dark color scheme
- **Static Export**: Optimized for GitHub Pages deployment

## 🛠️ Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Internationalization**: next-intl
- **Deployment**: GitHub Pages

## 🏗️ Project Structure

```
src/
├── app/[locale]/          # App router with internationalization
├── components/
│   ├── sections/          # Main page sections
│   └── ui/               # Reusable UI components
├── lib/                  # Utilities and data
├── messages/             # Translation files
└── types/               # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/my-portfolio.git
cd my-portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Deployment to GitHub Pages

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Setup Instructions

1. **Repository Settings**:
   - Go to your repository Settings > Pages
   - Source: "GitHub Actions"

2. **Update Configuration**:
   - Update the `basePath` and `assetPrefix` in `next.config.ts` to match your repository name
   - Update the repository URL in the GitHub Actions workflow

3. **Deploy**:
   - Push to the `main` branch
   - GitHub Actions will automatically build and deploy your site

The site will be available at: `https://yourusername.github.io/repository-name`

## 🎨 Customization

### Personal Information

Update your personal information in:
- `src/lib/data.ts` - Portfolio data (experiences, skills, projects, contact)
- `src/messages/` - Translation files for both languages

### Styling

- Colors and themes: `src/app/globals.css` and Tailwind config
- Components: Individual component files in `src/components/`

### Content

- **Hero Section**: Update name and title in translation files
- **About**: Modify experiences and personal description
- **Skills**: Add/remove skills and categories
- **Projects**: Update project information and links
- **Contact**: Update contact information

## 📱 Sections

- **Hero**: Welcome section with call-to-action buttons
- **About**: Personal information and work experience
- **Skills**: Interactive skills showcase with categories
- **Projects**: Portfolio projects with live demos and source code
- **Contact**: Contact form and social media links

## 🌍 Internationalization

The site supports:
- **Portuguese (PT-BR)**: Default language
- **English**: Alternative language

Language switching is available via the navbar component.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Contact

- **Email**: afgoulart.rj@gmail.com
- **Phone**: +55 (21) 98536-4597
- **Location**: Rio de Janeiro, Brasil
- **LinkedIn**: [André Filipe de Moraes Goulart](https://www.linkedin.com/in/afgoulart)
- **GitHub**: [afgoulart](https://github.com/afgoulart)

---

Built with ❤️ using Next.js and modern web technologies.
