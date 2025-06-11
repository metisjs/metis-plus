import { faker } from '@faker-js/faker';
import { delay, http, HttpResponse } from 'msw';
import type { CurrentUser } from '@/types/user';
import type { UserPermissions } from '@/utils/auth';

const userHandles = [
  http.post('/api/login', async ({ request }) => {
    await delay(600);

    const { username, password } = (await request.json()) as { username: string; password: string };
    if (
      (username === 'admin' && password === 'admin') ||
      (username === 'user' && password === 'user')
    ) {
      return HttpResponse.json({ success: true, data: { token: `fake_token_${username}` } });
    }
    return HttpResponse.json({
      success: false,
      errorCode: 10010,
      errorMessage: 'login.form.login.errMsg',
    });
  }),
  http.post('/api/logout', () => HttpResponse.json({ success: true })),
  http.get('/api/currentUser', async ({ request }) => {
    const token =
      request.headers.get('authorization') || request.headers.get('Authorization') || '';

    let permissions: UserPermissions = [];
    if (token === 'fake_token_admin') {
      permissions = [{ resource: 'admin', actions: ['read', 'edit', 'delete'] }];
    } else if (token === 'fake_token_user') {
      permissions = [];
    } else {
      return HttpResponse.json({
        success: false,
        errorCode: 10401,
      });
    }
    const data: CurrentUser = {
      name: faker.person.firstName(),
      age: faker.number.int({ min: 18, max: 35 }),
      avatar: faker.image.avatar(),
      job: faker.person.jobTitle(),
      email: faker.internet.email(),
      permissions,
    };
    return HttpResponse.json({ success: true, data });
  }),
];

export default userHandles;
