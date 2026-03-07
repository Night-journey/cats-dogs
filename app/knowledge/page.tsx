import Card from '@/components/Card';

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
  '采用“少量多次”方式，避免一次喂太多引起呕吐。',
  '长期喂养建议定点定时，便于绝育与健康管理。',
];

async function getArticles() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/articles`, { cache: 'no-store' });
  return res.json();
}

export default async function KnowledgePage() {
  const articles: Article[] = await getArticles();

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-cyan-50 p-6">
        <p className="mb-2 text-sm font-medium text-emerald-700">校园流浪动物科普</p>
        <h2 className="mb-2 text-2xl font-bold text-slate-900">遇到受伤动物怎么办？如何正确喂食？</h2>
        <p className="text-sm text-slate-600">
          先稳住现场、再判断伤情、及时联系救助。科学喂养和规范记录能显著提升救助成功率。
        </p>
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

      <section>
        <h3 className="mb-3 text-xl font-semibold">📚 延伸阅读</h3>
        <div className="space-y-3">
          {articles.map((article) => (
            <a
              key={article.id}
              href={`/knowledge/${article.id}`}
              className="block rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-sm"
            >
              <p className="font-semibold text-slate-900">{article.title}</p>
              <p className="mt-1 inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{article.category}</p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
