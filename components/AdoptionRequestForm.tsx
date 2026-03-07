'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type AnimalOption = { id: number; name: string; adoption_status: string };

export default function AdoptionRequestForm({ animals, defaultAnimalId }: { animals: AnimalOption[]; defaultAnimalId?: number }) {
  const router = useRouter();
  const selectable = useMemo(() => animals.filter((a) => a.adoption_status !== 'adopted'), [animals]);
  const [animalId, setAnimalId] = useState(defaultAnimalId || selectable[0]?.id || 0);
  const [applicantName, setApplicantName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [housingInfo, setHousingInfo] = useState('');
  const [incomeInfo, setIncomeInfo] = useState('');
  const [petExperience, setPetExperience] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setIsError(false);
    try {
      const res = await fetch('/api/adoption-requests', {
    credentials: 'include', 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          animal_id: Number(animalId),
          applicant_name: applicantName,
          contact,
          message,
          housing_info: housingInfo,
          income_info: incomeInfo,
          pet_experience: petExperience
        })
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setIsError(true);
        setFeedback(data?.error || '提交失败，请先登录');
        return;
      }
      setFeedback('申请已提交，请等待管理员审核。');
      setApplicantName('');
      setContact('');
      setMessage('');
      setHousingInfo('');
      setIncomeInfo('');
      setPetExperience('');
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  if (!selectable.length) {
    return <p className="rounded-xl bg-white/90 p-4 text-sm text-slate-600">当前暂无可申请领养的动物。</p>;
  }

  return (
    <section className="rounded-2xl border border-amber-100 bg-white/90 p-4 shadow-sm">
      <h3 className="font-semibold text-amber-900">提交领养申请</h3>
      <p className="mt-1 text-sm text-slate-600">填写申请信息后，管理员会尽快与你联系。</p>
      <form onSubmit={onSubmit} className="mt-3 grid gap-3 md:grid-cols-2">
        <select value={animalId} onChange={(e) => setAnimalId(Number(e.target.value))} className="rounded-xl border border-amber-200 px-3 py-2" required>
          {selectable.map((animal) => (
            <option key={animal.id} value={animal.id}>{animal.name}</option>
          ))}
        </select>
        <input className="rounded-xl border border-amber-200 px-3 py-2" placeholder="申请人姓名" value={applicantName} onChange={(e) => setApplicantName(e.target.value)} required />
        <input className="rounded-xl border border-amber-200 px-3 py-2 md:col-span-2" placeholder="联系方式（手机/微信）" value={contact} onChange={(e) => setContact(e.target.value)} required />
        <input className="rounded-xl border border-amber-200 px-3 py-2" placeholder="居住情况（自有/合租）" value={housingInfo} onChange={(e) => setHousingInfo(e.target.value)} required />
        <input className="rounded-xl border border-amber-200 px-3 py-2" placeholder="收入情况（稳定性说明）" value={incomeInfo} onChange={(e) => setIncomeInfo(e.target.value)} required />
        <textarea className="rounded-xl border border-amber-200 px-3 py-2 md:col-span-2" rows={3} placeholder="养宠经验（年限、绝育、疫苗等）" value={petExperience} onChange={(e) => setPetExperience(e.target.value)} required />
        <textarea className="rounded-xl border border-amber-200 px-3 py-2 md:col-span-2" rows={4} placeholder="补充说明（养宠经验、居住情况等）" value={message} onChange={(e) => setMessage(e.target.value)} required />
        <button disabled={loading} className="w-fit rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-70">{loading ? '提交中…' : '提交申请'}</button>
      </form>
      <p className={`mt-2 min-h-6 text-sm ${feedback ? (isError ? 'text-rose-700' : 'text-emerald-700') : 'text-slate-500'}`}>{feedback}</p>
    </section>
  );
}
