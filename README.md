# 🌍 CountryStateCityAPI - Country, State, City API

[![Node.js](https://img.shields.io/badge/Node.js-16%2B-green.svg)](https://nodejs.org/)
[![Fastify](https://img.shields.io/badge/Fastify-4.x-blue.svg)](https://www.fastify.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)]

A lightning-fast, high-performance REST API built with Fastify to serve comprehensive Country, State, and City data. Perfect for building address forms, location-based applications, and geographical data services.

## ✨ Features

- ⚡ **Ultra High Performance**: Optimized lookup maps for O(1) data access
- 🚀 **Lightning Fast Startup**: Data loaded once at server startup
- 🔍 **Robust Error Handling**: Proper HTTP status codes and descriptive error messages
- 🌐 **Complete Coverage**: Comprehensive global country, state, and city data

## 🚀 Quick Start

### Prerequisites

- Node.js 16.0.0 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**:
```bash
git clone https://github.com/yourusername/csc-api.git
cd csc-api
```

2. **Install dependencies**:
```bash
npm install
```

3. **Configure environment** (optional):
```bash
cp .env.example .env
# Edit .env file to customize port and other settings
```

4. **Start the server**:
```bash
# Production
npm start

# Development with auto-restart
npm run dev
```

The server will start on `http://localhost:3000` (or your configured port)

## ⚙️ Configuration

The API can be configured using environment variables. Copy `.env.example` to `.env` and modify as needed:

```env
# Server Configuration
PORT=3000              # Port to run the server on
HOST=0.0.0.0          # Host address to bind to
```

## 📖 API Documentation

### Base URL
```
http://localhost:3000
```

### Authentication
No authentication required - this is a public API.

### Rate Limiting
Currently no rate limiting is implemented. Consider implementing rate limiting for production use.

### 1. 🌍 Get All Countries
```http
GET /api/v1/countries
```

**Description**: Retrieve a complete list of all countries with their ISO codes and phone codes.

**Response**: Array of country objects

**Example Request**:
```bash
curl -X GET http://localhost:3000/api/v1/countries
```

**Example Response**:
```json
[
  {
    "id": 1,
    "name": "Afghanistan",
    "iso2": "AF",
    "iso3": "AFG",
    "phonecode": "93"
  },
  {
    "id": 2,
    "name": "United States",
    "iso2": "US",
    "iso3": "USA",
    "phonecode": "1"
  }
]
```

### 2. 🏛️ Get States by Country Code
```http
GET /api/v1/states/:countryCode
```

**Description**: Retrieve all states/provinces for a specific country.

**Parameters**:
- `countryCode` (string, required): ISO2 country code (e.g., "US", "IN", "GB", "CA")

**Response**: Array of state objects

**Example Request**:
```bash
curl -X GET http://localhost:3000/api/v1/states/US
```

**Example Response**:
```json
[
  {
    "id": 1,
    "name": "Alabama"
  },
  {
    "id": 2,
    "name": "Alaska"
  },
  {
    "id": 3,
    "name": "California"
  }
]
```

### 3. 🏙️ Get Cities by Country and State
```http
GET /api/v1/cities/:countryCode/:stateId
```

**Description**: Retrieve all cities for a specific state within a country.

**Parameters**:
- `countryCode` (string, required): ISO2 country code (e.g., "US", "IN", "GB")
- `stateId` (number, required): State ID from the states endpoint

**Response**: Array of city objects

**Example Request**:
```bash
curl -X GET http://localhost:3000/api/v1/cities/US/5
```

**Example Response**:
```json
[
  {
    "id": 1,
    "name": "Los Angeles"
  },
  {
    "id": 2,
    "name": "San Francisco"
  },
  {
    "id": 3,
    "name": "San Diego"
  }
]
```

### 4. ❤️ Health Check
```http
GET /health
```

**Description**: Check if the API server is running and healthy.

**Example Request**:
```bash
curl -X GET http://localhost:3000/health
```

**Example Response**:
```json
{
  "status": "OK",
  "timestamp": "2025-06-18T10:30:00.000Z",
  "uptime": 3600
}
```

### 5. 📚 API Documentation
```http
GET /
```

**Description**: Get API information and interactive documentation.

**Example Request**:
```bash
curl -X GET http://localhost:3000/
```

## 🏗️ Architecture & Performance

### Performance Optimizations

1. **🚀 Startup Data Loading**: JSON data is parsed and loaded once at server startup for maximum efficiency
2. **🗺️ Optimized Lookup Maps**: Uses JavaScript Maps for O(1) data access instead of O(n) array searches
3. **💾 Memory Efficient**: Only stores essential fields in lookup structures
4. **⚡ Fast Serialization**: Pre-structured data enables lightning-fast JSON responses
5. **🔄 Zero Runtime Processing**: All data transformations happen at startup

## 🛠️ Development

### Project Structure
```
/
├── server.js          # Main application server
├── data/              # Data directory
│   ├── csc.json       # Complete geographical data
│   └── csc.min.json   # Minified version of data
├── package.json       # Dependencies and scripts
├── .env.example       # Environment configuration template
├── .gitignore         # Git ignore rules
└── README.md          # This documentation
```

## 🚨 Error Handling

The API provides comprehensive error handling with appropriate HTTP status codes:

| Status Code | Description | Example |
|-------------|-------------|---------|
| `200` | Success | Valid request with data |
| `404` | Not Found | Country/State not found |
| `400` | Bad Request | Invalid parameters |
| `500` | Internal Server Error | Server-side error |

### Error Response Format
```json
{
  "error": "Country not found",
  "statusCode": 404,
  "message": "The country code 'XY' was not found in database"
}
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow existing code style and patterns
- Add tests for new features
- Update documentation for API changes
- Ensure all tests pass before submitting PR

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [Fastify](https://www.fastify.io/) - Fast and low overhead web framework
- Geographical data sourced from various open datasets
- Inspired by the need for fast, reliable geographical APIs

## 📞 Support
- 📧 **Email**: nitishkumar.blog@gmail.com

## 🗺️ Roadmap

- [ ] Add caching layer (Redis support)
- [ ] Implement rate limiting
- [ ] Add GraphQL support

---

**⭐ If this project helped you, please consider giving it a star on GitHub!**