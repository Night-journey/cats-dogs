import Link from 'next/link';
import AnimalNoteComposer from '@/components/AnimalNoteComposer';
import AnimalCorrectionComposer from '@/components/AnimalCorrectionComposer';
import ModerationControl from '@/components/ModerationControl';
import AdminDeleteButton from '@/components/AdminDeleteButton';
import { getAuthFromCookies } from '@/lib/auth';

function normalizeStatus(status?: string) {
  if (!status) return '未知';
  const statusMap: Record<string, string> = {
    'campus_resident': '在校活跃',
    'adopted': '被领养',
    'medical': '就医中',
    'deceased': '在喵星'
  };
  return statusMap[status] || status;
}

function calculateAge(birthDate?: string): string {
  if (!birthDate) return '未知';
  const birth = new Date(birthDate);
  const now = new Date();
  const years = now.getFullYear() - birth.getFullYear();
  const months = now.getMonth() - birth.getMonth();
  
  if (years > 0) {
    if (months >= 0) {
      return `${years}岁${months}个月`;
    }
    return `${years - 1}岁${12 + months}个月`;
  } else {
    const totalMonths = (now.getFullYear() - birth.getFullYear()) * 12 + months;
    if (totalMonths > 0) {
      return `${totalMonths}个月`;
    }
    return '小于1个月';
  }
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '未知';
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
}

async function getAnimal(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/animals/${id}`, { cache: 'no-store' });
  return res.json();
}

async function getAnimalNotes(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/animals/${id}/notes`, { cache: 'no-store' });
  return res.json();
}

async function getAnimalCorrections(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/animals/${id}/corrections`, { cache: 'no-store' });
  return res.json();
}

export default async function AnimalDetail({ params }: { params: { id: string } }) {
  const auth = await getAuthFromCookies();
  const isAdmin = auth?.role === 'admin';
  const [animal, notes, corrections] = await Promise.all([
    getAnimal(params.id),
    getAnimalNotes(params.id),
    getAnimalCorrections(params.id)
  ]);

  return (
    <div className="mx-auto max-w-4xl space-y-4 rounded-3xl border bg-white p-6">
      <Link href="/animals" className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900">
        ← 返回猫狗图鉴
      </Link>

      <div className="grid gap-6 md:grid-cols-[280px_1fr]">
        {animal.avatar_url ? (
          <img src={animal.avatar_url} alt={animal.name} className="aspect-[3/4] w-full rounded-2xl object-cover" />
        ) : null}

        <div className="space-y-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">{animal.name}</h2>
            <p className="mt-1 text-sm text-slate-600">别名：{animal.alias || '暂无'}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 rounded-2xl bg-amber-50/60 p-4">
            <div>
              <p className="text-xs text-amber-700">🐾 类型</p>
              <p className="font-medium text-slate-800">{animal.species === 'cat' ? '猫咪' : animal.species === 'dog' ? '狗狗' : animal.species}</p>
            </div>
            <div>
              <p className="text-xs text-amber-700">🎨 花色</p>
              <p className="font-medium text-slate-800">{animal.coat_color || '未知'}</p>
            </div>
            <div>
              <p className="text-xs text-amber-700">⚧ 性别</p>
              <p className="font-medium text-slate-800">{animal.gender || '未知'}</p>
            </div>
            <div>
              <p className="text-xs text-amber-700">🎂 破壳日</p>
              <p className="font-medium text-slate-800">{formatDate(animal.birth_date)}</p>
              <p className="text-xs text-slate-500">（{calculateAge(animal.birth_date)}）</p>
            </div>
            <div>
              <p className="text-xs text-amber-700">💉 绝育状态</p>
              <p className="font-medium text-slate-800">{animal.neutered ? '已绝育' : '未绝育/未知'}</p>
            </div>
            <div>
              <p className="text-xs text-amber-700">📍 常驻地点</p>
              <p className="font-medium text-slate-800">{animal.location || '未知'}</p>
            </div>
            <div>
              <p className="text-xs text-amber-700">⏰ 活跃时间</p>
              <p className="font-medium text-slate-800">{animal.active_time || '未知'}</p>
            </div>
            <div>
              <p className="text-xs text-amber-700">📌 当前状态</p>
              <p className="font-medium text-slate-800">{normalizeStatus(animal.adoption_status)}</p>
            </div>
          </div>

          <div className="flex gap-2">
            {isAdmin && (
              <>
                <Link href={`/animals/${animal.id}/edit`} className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-800 hover:bg-amber-100">
                  编辑动物
                </Link>
                <AdminDeleteButton endpoint={`/api/animals/${animal.id}`} label="删除动物" redirectTo="/animals" />
              </>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {animal.feeding_guide && (
          <div className="rounded-2xl border border-amber-100 bg-amber-50/30 p-4">
            <p className="font-semibold text-amber-900">🍚 投喂指南</p>
            <p className="mt-1 text-sm text-slate-700 whitespace-pre-wrap">{animal.feeding_guide}</p>
          </div>
        )}

        {animal.description && (
          <div className="rounded-2xl border border-amber-100 bg-amber-50/30 p-4">
            <p className="font-semibold text-amber-900">📝 介绍</p>
            <p className="mt-1 text-sm text-slate-700 whitespace-pre-wrap">{animal.description}</p>
          </div>
        )}

        {animal.anecdotes && (
          <div className="rounded-2xl border border-amber-100 bg-amber-50/30 p-4">
            <p className="font-semibold text-amber-900">🌟 趣闻轶事</p>
            <p className="mt-1 text-sm text-slate-700 whitespace-pre-wrap">{animal.anecdotes}</p>
          </div>
        )}

        {animal.social_notes && (
          <div className="rounded-2xl border border-amber-100 bg-amber-50/30 p-4">
            <p className="font-semibold text-amber-900">👥 人际关系</p>
            <p className="mt-1 text-sm text-slate-700 whitespace-pre-wrap">{animal.social_notes}</p>
          </div>
        )}
      </div>

      <section className="space-y-2 pt-3">
        <h3 className="font-semibold text-amber-900">观察笔记（审核后展示）</h3>
        <AnimalNoteComposer animalId={animal.id} />
        <div className="space-y-2">
          {notes.map((n: any) => (
            <div key={n.id} className="rounded border border-amber-100 p-2 text-sm">
              <p className="font-medium text-slate-800">{n.author || '匿名用户'} {isAdmin ? `· ${n.status}` : ''}</p>
              <p className="text-slate-700">{n.content}</p>
              {isAdmin ? <ModerationControl id={n.id} current={n.status} updateEndpoint={`/api/animal-notes/${n.id}`} deleteEndpoint={`/api/animal-notes/${n.id}`} /> : null}
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-2 pt-3">
        <h3 className="font-semibold text-amber-900">资料纠错建议</h3>
        <AnimalCorrectionComposer animalId={animal.id} />
        <div className="space-y-2">
          {corrections.map((item: any) => (
            <div key={item.id} className="rounded border border-amber-100 p-2 text-sm">
              <p className="font-medium text-slate-800">{item.proposer || '匿名用户'} 提议修正 {item.field_name} {isAdmin ? `· ${item.status}` : ''}</p>
              <p className="text-slate-700">建议值：{item.suggested_value || '（空）'}</p>
              <p className="text-slate-600">原因：{item.reason || '（无）'}</p>
              {isAdmin ? <ModerationControl id={item.id} current={item.status} updateEndpoint={`/api/animal-corrections/${item.id}`} deleteEndpoint={`/api/animal-corrections/${item.id}`} /> : null}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
