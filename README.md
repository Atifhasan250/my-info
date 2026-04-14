# Atif Hasan - Link Portal & Projects Gallery

A professional, high-performance link aggregator and project portfolio tailored for tech professionals. Built specifically for **Atif Hasan**, a Full Stack Web and Mobile App Developer based in Bogura, Bangladesh. This application serves as a sleek alternative to standard Linktrees, providing an advanced interactive interface out-of-the-box.

![Portfolio Preview](./public/preview.png)

## Features

- **Dynamic Link Aggregation**: Seamlessly direct users to all relevant social networks, open-source repositories, and contact forms.
- **Project Gallery**: A dedicated section to showcase web and mobile app dev experiments, detailed with tech stack tags and featured highlights.
- **Admin Dashboard**: Full CRUD (Create, Read, Update, Delete) capability allowing the developer to manage links, projects, and profiles effortlessly—without touching the source code.
- **Optimized for SEO**: Built with robust Next.js server-side features ensuring high discoverability on Google.
- **Fully Responsive**: Crafted meticulously with Tailwind CSS to ensure a pristine experience on both desktop layout and mobile devices.
- **Dark/Light Mode**: Integrated theme toggling powered by Next Themes.

## Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 18)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Database**: MongoDB with [Mongoose](https://mongoosejs.com/)
- **Authentication**: JWT & custom hashed cookies
- **Media Hosting**: ImageKit.io
- **Deployment**: Vercel

## Getting Started

### Prerequisites

You need [Node.js](https://nodejs.org/) installed along with a MongoDB database URL and an ImageKit developer account.

### Local Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/atifhasan250/my-info.git
   cd my-info
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Duplicate the `.env.local.example` file to `.env.local` and substitute the respective API keys:
   ```env
   MONGODB_URI=your_mongodb_cluster_uri
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your_secure_password
   JWT_SECRET=your_jwt_secret

   IMAGEKIT_PUBLIC_KEY=your_imagekit_public
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private
   IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id/
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```

5. **Access the App**:
   Visit `http://localhost:3000` to view the public profile, and `http://localhost:3000/admin` to manage your data using the interactive dashboard.

## Contact & Links

- **Website**: [atifs-info.vercel.app](https://atifs-info.vercel.app/)
- **Location**: Bogura, Bangladesh
- **Profession**: Web & Mobile App Developer, Full Stack Developer

## License

This project is open-source and available under the MIT License. See the [LICENSE](LICENSE) file for more information.
