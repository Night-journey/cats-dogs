import Card from '@/components/Card';

export default function HomePage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Protect Campus Stray Cats & Dogs Together</h2>
      <p className="text-slate-600">Browse animal profiles, discuss in community forum, publish help requests, and apply for adoption.</p>
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Animal Encyclopedia">Search, filter, and view cats and dogs living on campus.</Card>
        <Card title="Forum">Share stories, images, and comments like a social feed.</Card>
        <Card title="Rescue & Adoption">Publish urgent requests and manage adoption pipeline.</Card>
      </div>
    </div>
  );
}
