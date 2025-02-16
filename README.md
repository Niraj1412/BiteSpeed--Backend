# Bitespeed Backend Task: Identity Reconciliation

## Project Description
This project is a web service designed to identify and keep track of a customer's identity across multiple purchases for FluxKart.com. The service consolidates customer contact information (email and phone number) and links different orders made with different contact information to the same person.

## Features
- Identify and reconcile customer contact information.
- Maintain a relational database of contacts with primary and secondary precedence.
- Provide a consolidated view of customer contact information through an API endpoint.

## Technologies Used
- Node.js
- TypeScript
- Express
- Sequelize (ORM)
- SQLite (Database)

## Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/your-repository.git
   cd your-repository
2. **Install dependencies:**
   ```sh
   npm install

## Usage

1. **Run the development server:**
   ```sh
   npm run dev
2. **Access the API:**
   ```sh
   The API will be running at http://localhost:3000.
3. **API Endpoint:**
   ```sh
   http://localhost:3000/api/identify
