Project Setup Guide
Cloning the Git Repository
Clone the project repository using the following command:

Copy code
git clone https://github.com/desuchan27/asianwave-admin.git


Installing Dependencies
Install the required npm packages by running:
npm install


Setting up Environment Variables
Create a .env file in the project root and add the following credentials:

dotenv
Copy code
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Prisma Database Connection
DATABASE_URL=''

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=""

# Stripe Integration
STRIPE_API_KEY=
STRIPE_WEBHOOK_SECRET=

# Frontend Store URL
FRONTEND_STORE_URL=http://localhost:3001
Note: Customize the values based on your specific configurations.

Database Connection and Migration
Generate Prisma client and apply migrations to the database:

bash
Copy code
npx prisma generate
npx prisma db push