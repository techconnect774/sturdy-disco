-- Test data for blog platform
-- Run this in your Supabase SQL Editor to create sample articles

-- First, get your user ID from the auth.users table
-- You can find this by running: SELECT id, email FROM auth.users;
-- Replace 'YOUR_USER_ID_HERE' below with your actual user ID

-- Sample Article 1: Getting Started with React
INSERT INTO articles (
  title,
  content,
  excerpt,
  author_id,
  is_published,
  published_at,
  created_at
) VALUES (
  'Getting Started with React in 2025',
  '<h2>Introduction to React</h2><p>React has become one of the most popular JavaScript libraries for building user interfaces. In this comprehensive guide, we''ll explore the fundamentals of React and help you get started with modern web development.</p><h3>Why Choose React?</h3><p>React offers several advantages:</p><ul><li>Component-based architecture for reusable code</li><li>Virtual DOM for optimal performance</li><li>Large ecosystem and community support</li><li>Excellent developer tools and debugging capabilities</li></ul><h3>Setting Up Your First Project</h3><p>The easiest way to start a React project is using Vite, which provides lightning-fast hot module replacement and an optimized build process.</p><pre><code>npm create vite@latest my-app -- --template react-ts\ncd my-app\nnpm install\nnpm run dev</code></pre><p>This creates a new React project with TypeScript support, giving you type safety and better developer experience.</p>',
  'Learn the fundamentals of React and build modern web applications with this comprehensive guide for beginners.',
  (SELECT id FROM auth.users LIMIT 1),
  true,
  NOW(),
  NOW() - INTERVAL '2 days'
);

-- Sample Article 2: Tailwind CSS Tips
INSERT INTO articles (
  title,
  content,
  excerpt,
  author_id,
  is_published,
  published_at,
  created_at
) VALUES (
  'Mastering Tailwind CSS: Pro Tips and Tricks',
  '<h2>Level Up Your Tailwind Skills</h2><p>Tailwind CSS has revolutionized the way we write CSS. Instead of writing custom stylesheets, we can build beautiful designs using utility classes directly in our markup.</p><h3>Essential Tailwind Concepts</h3><p>Understanding these core concepts will make you more productive:</p><ul><li><strong>Utility-First:</strong> Build complex designs from simple utilities</li><li><strong>Responsive Design:</strong> Use breakpoint prefixes like <code>md:</code> and <code>lg:</code></li><li><strong>Dark Mode:</strong> Toggle themes with the <code>dark:</code> variant</li><li><strong>Custom Configuration:</strong> Extend the default theme in tailwind.config.js</li></ul><h3>Pro Tips</h3><p>Here are some advanced techniques to improve your workflow:</p><ol><li>Use <code>@apply</code> directive for repeated patterns</li><li>Leverage the JIT compiler for on-demand class generation</li><li>Create custom utility classes for your design system</li><li>Use plugins like @tailwindcss/typography for rich text</li></ol>',
  'Discover advanced Tailwind CSS techniques to build beautiful, responsive designs faster than ever.',
  (SELECT id FROM auth.users LIMIT 1),
  true,
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '3 days'
);

-- Sample Article 3: TypeScript Best Practices
INSERT INTO articles (
  title,
  content,
  excerpt,
  author_id,
  is_published,
  published_at,
  created_at
) VALUES (
  'TypeScript Best Practices for Modern Development',
  '<h2>Write Better TypeScript Code</h2><p>TypeScript adds static typing to JavaScript, helping you catch errors early and write more maintainable code. Let''s explore some best practices that will make your TypeScript code shine.</p><h3>1. Use Strict Mode</h3><p>Always enable strict mode in your <code>tsconfig.json</code> to catch potential issues:</p><pre><code>{\n  "compilerOptions": {\n    "strict": true,\n    "noImplicitAny": true,\n    "strictNullChecks": true\n  }\n}</code></pre><h3>2. Leverage Type Inference</h3><p>TypeScript is smart enough to infer types in many cases. Don''t over-annotate:</p><pre><code>// Good\nconst count = 5;\n\n// Unnecessary\nconst count: number = 5;</code></pre><h3>3. Use Interfaces for Object Shapes</h3><p>Interfaces are perfect for defining the shape of objects:</p><pre><code>interface User {\n  id: string;\n  name: string;\n  email: string;\n  role: "admin" | "user";\n}</code></pre>',
  'Learn essential TypeScript best practices to write safer, more maintainable code in your projects.',
  (SELECT id FROM auth.users LIMIT 1),
  true,
  NOW() - INTERVAL '3 hours',
  NOW() - INTERVAL '4 days'
);

-- Sample Article 4: Draft Article
INSERT INTO articles (
  title,
  content,
  excerpt,
  author_id,
  is_published,
  published_at,
  created_at
) VALUES (
  'Building a Full-Stack App with Supabase (Draft)',
  '<h2>Introduction to Supabase</h2><p>This is a draft article that is not yet published. It won''t appear on the public homepage.</p><p>Supabase is an open-source Firebase alternative that provides all the backend services you need to build a modern application.</p>',
  'Learn how to build a complete full-stack application using Supabase for authentication, database, and storage.',
  (SELECT id FROM auth.users LIMIT 1),
  false,
  NULL,
  NOW() - INTERVAL '1 hour'
);

-- Add sample comments to the first article
INSERT INTO comments (
  article_id,
  author_name,
  content,
  is_approved,
  created_at
) VALUES 
(
  (SELECT id FROM articles WHERE title LIKE 'Getting Started with React%' LIMIT 1),
  'Jane Developer',
  'Great introduction to React! This really helped me understand the basics.',
  true,
  NOW() - INTERVAL '1 day'
),
(
  (SELECT id FROM articles WHERE title LIKE 'Getting Started with React%' LIMIT 1),
  'John Smith',
  'Thanks for the clear explanation. Looking forward to more tutorials!',
  true,
  NOW() - INTERVAL '12 hours'
),
(
  (SELECT id FROM articles WHERE title LIKE 'Mastering Tailwind%' LIMIT 1),
  'Sarah Designer',
  'These Tailwind tips are amazing! The dark mode section was particularly helpful.',
  true,
  NOW() - INTERVAL '6 hours'
);

-- Verify the data was inserted
SELECT 
  title, 
  is_published, 
  published_at,
  (SELECT COUNT(*) FROM comments WHERE comments.article_id = articles.id) as comment_count
FROM articles
ORDER BY created_at DESC;
