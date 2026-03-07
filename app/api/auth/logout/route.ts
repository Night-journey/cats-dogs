import { clearAuthCookie } from '@/lib/auth';
import { ok } from '@/lib/api';

export async function POST() {
  clearAuthCookie();
  return ok({ message: '已退出登录' });
}
