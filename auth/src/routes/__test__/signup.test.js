"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../app");
it('returns a 201 on successful signup', () => __awaiter(void 0, void 0, void 0, function* () {
    return (0, supertest_1.default)(app_1.app)
        .post('/api/users/signup')
        .send({
        email: 'test@test.com',
        password: 'password'
    })
        .expect(201);
}));
it('return a 400 on invalid email', () => __awaiter(void 0, void 0, void 0, function* () {
    return (0, supertest_1.default)(app_1.app)
        .post('/api/users/signup')
        .send({
        email: 'test.com',
        password: 'passoword'
    })
        .expect(400);
}));
it('return a 400 on missing email or password', () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, supertest_1.default)(app_1.app)
        .post('/api/users/signup')
        .send({
        email: 'test@test.com'
    })
        .expect(400);
    yield (0, supertest_1.default)(app_1.app)
        .post('/api/users/signup')
        .send({
        password: 'j3j0fjkl'
    })
        .expect(400);
}));
it('disallow duplicate emails', () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, supertest_1.default)(app_1.app)
        .post('/api/users/signup')
        .send({
        email: 'test@test.com',
        password: 'password'
    })
        .expect(201);
    yield (0, supertest_1.default)(app_1.app)
        .post('/api/users/signup')
        .send({
        email: 'test@test.com',
        password: 'password'
    })
        .expect(400);
}));
it('response with set-cookie', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("NODE_ENV :", process.env.NODE_ENV);
    const response = yield (0, supertest_1.default)(app_1.app)
        .post('/api/users/signup')
        .send({
        email: 'test@test.com',
        password: 'password'
    })
        .expect(201);
    expect(response.get('Set-Cookie')).toBeDefined();
}));
