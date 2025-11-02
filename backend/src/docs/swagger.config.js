import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import config from '../config/index.js';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MSJ Hackathon API',
      version: '1.0.0',
      description: 'Production-ready Express API for hackathons with JWT authentication',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
        description: 'Development server',
      },
      {
        url: 'https://your-production-url.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer <token>',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
              },
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
            },
            email: {
              type: 'string',
              format: 'email',
            },
            name: {
              type: 'string',
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Auth',
        description: 'Authentication endpoints',
      },
      {
        name: 'System',
        description: 'System health and monitoring',
      },
      {
        name: 'Centers',
        description: 'Youth center management',
      },
      {
        name: 'Events',
        description: 'Event management',
      },
      {
        name: 'Workshops',
        description: 'Workshop management',
      },
      {
        name: 'Clubs',
        description: 'Club management',
      },
      {
        name: 'Participation',
        description: 'User participation (instant join system)',
      },
      {
        name: 'Experience Sharing',
        description: 'Experience sessions and cards',
      },
      {
        name: 'Virtual School',
        description: 'Educational video content',
      },
      {
        name: 'Startup Space',
        description: 'Startup ideas and entrepreneurship',
      },
      {
        name: 'Learning Resources',
        description: 'Curated learning materials',
      },
      {
        name: 'Mentorship',
        description: 'Mentor-mentee connections',
      },
      {
        name: 'Users',
        description: 'User management',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to route files with JSDoc comments
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
  // Swagger UI
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'MSJ API Docs',
    })
  );

  // Swagger JSON
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};

export default setupSwagger;
