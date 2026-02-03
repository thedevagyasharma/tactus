import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CATEGORIES, getComponentsByCategory, ComponentCategory } from '@/lib/components';
import { ComponentCard } from '@/components/ui/ComponentCard';
import styles from './page.module.css';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateStaticParams() {
  return Object.keys(CATEGORIES).map((category) => ({
    category,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category } = await params;
  const categoryData = CATEGORIES[category as ComponentCategory];

  if (!categoryData) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: `${categoryData.name} - Tactus`,
    description: categoryData.description,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const categoryData = CATEGORIES[category as ComponentCategory];

  if (!categoryData) {
    notFound();
  }

  const components = getComponentsByCategory(category as ComponentCategory);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>{categoryData.name}</h1>
          <p className={styles.description}>{categoryData.description}</p>
          <div className={styles.count}>
            {components.length} component{components.length !== 1 ? 's' : ''}
          </div>
        </header>

        {components.length > 0 ? (
          <div className={styles.grid}>
            {components.map(component => (
              <ComponentCard key={component.id} component={component} />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <p className={styles.emptyText}>No components in this category yet.</p>
            <Link href="/" className={styles.emptyLink}>
              Browse all components
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
