'use strict';

const axios = require('axios');
const authController = require('../src/controllers/auth.controller');
const User = require('../src/models/User');

jest.mock('axios');
jest.mock('../src/models/User');

describe('Auth Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      headers: {},
      user: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return 400 if email or password is missing', async () => {
      req.body = { email: 'test@example.com' };
      await authController.login(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Email and password are required' });
    });

    it('should return tokens and user info on successful login', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      
      axios.post.mockResolvedValueOnce({
        data: {
          access_token: 'access_token_123',
          id_token: 'id_token_123',
          refresh_token: 'refresh_token_123',
          expires_in: 3600,
        },
      });

      axios.get.mockResolvedValueOnce({
        data: { sub: 'user_123', email: 'test@example.com' },
      });

      await authController.login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        access_token: 'access_token_123',
        user: expect.objectContaining({ email: 'test@example.com' }),
      }));
    });

    it('should return 401 if Asgardeo authentication fails', async () => {
      req.body = { email: 'test@example.com', password: 'wrong_password' };
      
      axios.post.mockRejectedValueOnce({
        response: { data: { error: 'invalid_grant' } },
      });

      await authController.login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Incorrect email or password' });
    });
  });

  describe('syncProfile', () => {
    it('should upsert user profile using findOneAndUpdate', async () => {
      req.jwtClaims = {
        sub: 'asgardeo_sub_123',
        given_name: 'John',
        family_name: 'Doe',
        email: 'john@example.com',
      };

      const mockUser = {
        _id: 'mongo_id_123',
        fullName: 'John Doe',
        email: 'john@example.com',
        asgardeoSub: 'asgardeo_sub_123',
      };

      User.findOne.mockResolvedValueOnce(null);
      User.findOneAndUpdate.mockResolvedValueOnce(mockUser);

      await authController.syncProfile(req, res, next);

      expect(User.findOneAndUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          $or: expect.arrayContaining([
            { asgardeoSub: 'asgardeo_sub_123' },
            { email: 'john@example.com' }
          ]),
        }),
        expect.any(Object),
        expect.objectContaining({ upsert: true })
      );
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ user: mockUser });
    });

    it('should return 400 if email claim is missing', async () => {
      req.jwtClaims = { sub: 'sub_123' };
      await authController.syncProfile(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.stringContaining('email claim') }));
    });
  });
});
