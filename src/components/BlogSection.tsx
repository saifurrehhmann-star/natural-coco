import { ArrowRight } from 'lucide-react';
import { BLOG_POSTS } from '@/data';

export function BlogSection() {
  return (
    <section id="blog" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="reveal mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-palm-500">
            From the Blog
          </p>
          <h2 className="mt-1 text-2xl font-extrabold text-palm-900 sm:text-3xl">
            Fresh reads & hydration tips
          </h2>
        </div>
        <a
          href="#blog"
          className="hidden items-center gap-1 text-sm font-semibold text-palm-600 hover:text-palm-800 sm:flex"
        >
          View All Posts <ArrowRight size={16} />
        </a>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {BLOG_POSTS.map((post, i) => (
          <article
            key={post.id}
            className="reveal group cursor-pointer overflow-hidden rounded-3xl bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <span className="absolute left-3 top-3 chip bg-white/90 text-[10px] uppercase tracking-wide text-palm-700">
                {post.category}
              </span>
            </div>
            <div className="p-5">
              <p className="text-xs font-medium text-palm-500">{post.readTime}</p>
              <h3 className="mt-1 text-lg font-extrabold leading-tight text-palm-900 group-hover:text-palm-700">
                {post.title}
              </h3>
              <p className="mt-2 text-sm text-palm-600 line-clamp-3">{post.excerpt}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-coral-600">
                Read More <ArrowRight size={15} />
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
