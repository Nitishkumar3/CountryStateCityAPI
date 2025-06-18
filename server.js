require('dotenv').config();

const fastify = require('fastify')({ logger: true });
const fs = require('fs');
const path = require('path');

let cscData = null;
let countriesMap = new Map();
let statesMap = new Map();
let citiesMap = new Map();

// Initialize data on startup
async function initializeData() {
    try {
        const dataPath = path.join(__dirname, 'data', 'csc.min.json');
        const rawData = fs.readFileSync(dataPath, 'utf8');
        cscData = JSON.parse(rawData);

        // Build optimized lookup maps for O(1) access
        cscData.forEach(country => {
            countriesMap.set(country.iso2.toLowerCase(), {
                id: country.id,
                name: country.name,
                iso2: country.iso2,
                iso3: country.iso3,
                phonecode: country.phonecode
            });

            const countryStates = new Map();
            if (country.states && Array.isArray(country.states)) {
                country.states.forEach(state => {
                    countryStates.set(state.id, {
                        id: state.id,
                        name: state.name
                    });

                    const stateCities = new Map();
                    if (state.cities && Array.isArray(state.cities)) {
                        state.cities.forEach(city => {
                            stateCities.set(city.id, {
                                id: city.id,
                                name: city.name
                            });
                        });
                    }
                    citiesMap.set(`${country.iso2.toLowerCase()}-${state.id}`, stateCities);
                });
            }
            statesMap.set(country.iso2.toLowerCase(), countryStates);
        });
    } catch (error) {
        console.error('Error loading CSC data:', error);
        process.exit(1);
    }
}

// Schemas
const countrySchema = {
    type: 'object',
    properties: {
        id: { type: 'number' },
        name: { type: 'string' },
        iso2: { type: 'string' },
        iso3: { type: 'string' },
        phonecode: { type: 'string' }
    }
};

const stateSchema = {
    type: 'object',
    properties: {
        id: { type: 'number' },
        name: { type: 'string' }
    }
};

const citySchema = {
    type: 'object',
    properties: {
        id: { type: 'number' },
        name: { type: 'string' }
    }
};

// Route: Get all countries
fastify.get('/api/v1/countries', {
    schema: {
        description: 'Get all countries with id, name, iso2, iso3, and phonecode',
        response: {
            200: {
                type: 'array',
                items: countrySchema
            }
        }
    }
}, async (request, reply) => {
    try {
        const countries = Array.from(countriesMap.values());
        return countries;
    } catch (error) {
        reply.code(500).send({ error: 'Internal server error' });
    }
});

// Route: Get states by country code
fastify.get('/api/v1/states/:countryCode', {
    schema: {
        description: 'Get all states for a specific country',
        params: {
            type: 'object',
            properties: {
                countryCode: { type: 'string', description: 'ISO2 country code (e.g., US, IN, GB)' }
            },
            required: ['countryCode']
        },
        response: {
            200: {
                type: 'array',
                items: stateSchema
            },
            404: {
                type: 'object',
                properties: {
                    error: { type: 'string' }
                }
            }
        }
    }
}, async (request, reply) => {
    try {
        const { countryCode } = request.params;
        const countryKey = countryCode.toLowerCase();

        const states = statesMap.get(countryKey);
        if (!states) {
            return reply.code(404).send({ error: 'Country not found' });
        }

        return Array.from(states.values());
    } catch (error) {
        reply.code(500).send({ error: 'Internal server error' });
    }
});

// Route: Get cities by country code and state code
fastify.get('/api/v1/cities/:countryCode/:stateCode', {
    schema: {
        description: 'Get all cities for a specific country and state',
        params: {
            type: 'object',
            properties: {
                countryCode: { type: 'string', description: 'ISO2 country code (e.g., US, IN, GB)' },
                stateCode: { type: 'string', description: 'State ID' }
            },
            required: ['countryCode', 'stateCode']
        },
        response: {
            200: {
                type: 'array',
                items: citySchema
            },
            404: {
                type: 'object',
                properties: {
                    error: { type: 'string' }
                }
            }
        }
    }
}, async (request, reply) => {
    try {
        const { countryCode, stateCode } = request.params;
        const countryKey = countryCode.toLowerCase();
        const cityKey = `${countryKey}-${stateCode}`;

        if (!statesMap.has(countryKey)) {
            return reply.code(404).send({ error: 'Country not found' });
        }

        const states = statesMap.get(countryKey);
        if (!states.has(parseInt(stateCode))) {
            return reply.code(404).send({ error: 'State not found for this country' });
        }

        const cities = citiesMap.get(cityKey);
        if (!cities) {
            return reply.code(404).send({ error: 'No cities found for this state' });
        }

        return Array.from(cities.values());
    } catch (error) {
        reply.code(500).send({ error: 'Internal server error' });
    }
});

// Health check endpoint
fastify.get('/health', async (request, reply) => {
    return { status: 'OK', timestamp: new Date().toISOString() };
});

// Root endpoint with API information
fastify.get('/', async (request, reply) => {
    return {
        message: 'CSC (Country, State, City) API',
        version: '1.0.0', endpoints: {
            'GET /api/v1/countries': 'Get all countries',
            'GET /api/v1/states/:countryCode': 'Get states by country code (ISO2)',
            'GET /api/v1/cities/:countryCode/:stateCode': 'Get cities by country and state code',
            'GET /health': 'Health check'
        }, examples: {
            countries: '/api/v1/countries',
            states: '/api/v1/states/US',
            cities: '/api/v1/cities/US/1'
        }
    };
});

// Start server
const start = async () => {
    try {
        const port = process.env.PORT || 3000;
        const host = process.env.HOST || '0.0.0.0';

        await initializeData();
        await fastify.listen({ port: parseInt(port), host });
        console.log(`API server is running on http://localhost:${port}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();