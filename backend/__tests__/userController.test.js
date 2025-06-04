const {registerUser,loginUser}=require("../controllers/userController");
const { generateToken } = require('../middleware/authMiddleware'); 
const {
    userByGmail,
    comparePass,
    createUser,
} = require("../models/userModel");

jest.mock("../models/userModel");
jest.mock("../middleware/authMiddleware")

describe('registerUser', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
  });

  it('should return 400 if required fields are missing', async () => {
    req.body = { name: '', email: '', password: '' };

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'All fields are required.' });
  });

  it('should return 400 if user already exists', async () => {
    userByGmail.mockResolvedValue({ id: 1 });

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith('User already exists');
  });

  it('should return 201 if user is created successfully', async () => {
    userByGmail.mockResolvedValue(null);
    createUser.mockResolvedValue({ id: 1, name: 'Test User' });

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'User created successfully.'
    });
  });

  it('should return 500 on error', async () => {
    userByGmail.mockRejectedValue(new Error('Database Error'));

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Internal Server Error');
  });
});

describe('loginUser', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {
        email: 'test@example.com',
        password: 'password123'
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
  });

  it('should return 404 if user not found', async () => {
    userByGmail.mockResolvedValue(null);

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith('User not found');
  });

  it('should return 401 if password does not match', async () => {
    userByGmail.mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      password: 'hashedPassword'
    });

    comparePass.mockResolvedValue(false);

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith('Password not match!');
  });

  it('should return 200 and token on successful login', async () => {
    const fakeUser = {
      id: 1,
      email: 'test@example.com',
      password: 'hashedPassword',
      role: 'user'
    };

    userByGmail.mockResolvedValue(fakeUser);
    comparePass.mockResolvedValue(true);
    generateToken.mockReturnValue('mockToken');

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Login Sucessfull',
      token: 'mockToken'
    });
  });

  it('should return 500 on error', async () => {
    userByGmail.mockRejectedValue(new Error('DB error'));

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Internal Server Error');
  });
});