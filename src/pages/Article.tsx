import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { ArticleView } from '../components/blog/ArticleView';

export function Article() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <Header />
      <main className="flex-1">
        <ArticleView />
      </main>
      <Footer />
    </div>
  );
}
