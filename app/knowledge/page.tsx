import Link from 'next/link';
import Card from '@/components/Card';
import { getAuthFromCookies } from '@/lib/auth';

type Article = {
  id: number;
  title: string;
  category: string;
};

const emergencySteps = [
  {
    title: '先保证人和动物的安全距离',
    desc: '不要直接徒手抱起受伤动物，先观察是否存在攻击风险或骨折情况。可用书包、纸箱等做简易隔离。',
  },
  {
    title: '快速判断伤情并拍照记录',
    desc: '重点关注出血、呼吸、站立状态。拍照可帮助校内救助团队或宠物医院远程判断是否需要急救。',
  },
  {
    title: '联系校内志愿者/附近医院',
    desc: '尽量提供位置、动物体型、受伤时间。若大量出血，可用干净纱布轻压止血并尽快送医。',
  },
  {
    title: '减少移动，必要时平稳转运',
    desc: '怀疑骨折时避免频繁抱动，使用平整硬板或箱子转运，降低二次伤害风险。',
  },
];

const feedingTips = [
  '优先提供干净饮水，脱水比饥饿更危险。',
  '猫可少量喂湿粮或白水煮鸡胸肉，狗可喂清淡肉类+少量主食。',
  '避免投喂牛奶、辛辣/高盐食物、鸡鸭细骨。',
  '采用"少量多次"方式，避免一次喂太多引起呕吐。',
  '长期喂养建议定点定时，便于绝育与健康管理。',
];

const newArticles = [
  {
    emoji: '💉',
    title: '绝育的重要性',
    tags: ['绝育', 'TNR'],
    content: '绝育可以有效控制流浪动物数量，减少无序繁殖。同时也能降低某些疾病的风险，改善动物的行为问题。',
  },
  {
    emoji: '❄️',
    title: '冬季关爱指南',
    tags: ['冬季保暖'],
    content: '冬天要为流浪动物提供避风保暖的窝。可以使用纸箱加上旧衣物制作简易猫窝。确保它们有未结冰的饮用水。',
  },
  {
    emoji: '🏠',
    title: '临时安置建议',
    tags: ['安置', '临时'],
    content: '如果需要临时安置流浪动物，准备一个安静、温暖的空间。提供食物、水和猫砂。尽快联系救助组织或寻找领养家庭。',
  },
  {
    emoji: '🐱',
    title: '如何与流浪猫相处',
    tags: ['互动', '关系'],
    content: '不要突然靠近或大声说话。保持距离慢慢建立信任。可以先放置食物让它熟悉你的气味。耐心是建立关系的关键。',
  },
  {
    emoji: '⚠️',
    title: '安全注意事项',
    tags: ['安全', '健康'],
    content: '与流浪动物接触时要注意安全：不要直视它的眼睛、不要突然移动、不要在母兽面前靠近幼崽。勤洗手，预防疾病传播。',
  },
];

async function getArticles() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/articles`, { cache: 'no-store' });
  return res.json();
}

export default async function KnowledgePage() {
  const [articles, auth] = await Promise.all([getArticles(), getAuthFromCookies()]);
  const isAdmin = auth?.role === 'admin';

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-cyan-50 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="mb-2 text-sm font-medium text-emerald-700">校园流浪动物科普</p>
            <h2 className="mb-2 text-2xl font-bold text-slate-900">校园流浪动物救助指南</h2>
            <p className="text-sm text-slate-600">科学救助、规范喂养，让每一只流浪动物都能得到关爱。</p>
          </div>
          {isAdmin ? (
            <Link href="/knowledge/new" className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
              + 新增文章
            </Link>
          ) : null}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="🩹 遇到受伤动物的处理流程">
          <ol className="space-y-3 text-sm text-slate-700">
            {emergencySteps.map((step, index) => (
              <li key={step.title} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="font-semibold text-slate-900">
                  {index + 1}. {step.title}
                </p>
                <p className="mt-1">{step.desc}</p>
              </li>
            ))}
          </ol>
        </Card>

        <Card title="🍽️ 正确喂食建议">
          <ul className="space-y-2 text-sm text-slate-700">
            {feedingTips.map((tip) => (
              <li key={tip} className="rounded-lg border border-amber-100 bg-amber-50 p-3">
                {tip}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-slate-500">提示：出现持续不吃、腹泻、呕吐、精神沉郁时，应尽快咨询专业兽医。</p>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {newArticles.map((article) => (
          <Card key={article.title} title={`${article.emoji} ${article.title}`}>
            <p className="text-sm text-slate-700">{article.content}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
                  {tag}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
