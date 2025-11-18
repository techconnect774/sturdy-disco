import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { ArticleFeed } from '../components/blog/ArticleFeed';

export function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <Header />
      <main className="flex-1">
        <ArticleFeed />
      </main>
      <Footer />
    </div>
  );
}
