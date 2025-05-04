'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from 'antd';
import { toast } from 'sonner';

export default function RedirectPage() {
  const router = useRouter();
  const [slug, setSlug] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!slug.trim()) {
      setError('Please enter a shortened URL code');
      toast.error('Please enter a shortened URL code');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/decode/${slug}`);
      
      if (!response.ok) {
        throw new Error('Invalid shortened URL');
      }

      const data = await response.json();
      
      if (data.originalUrl) {
        window.open(data.originalUrl, '_blank', 'noopener,noreferrer');
      } else {
        throw new Error('Invalid shortened URL');
      }
    } catch (error) {
      console.error('Failed to decode URL:', error);
      setError('Failed to find the original URL');
      toast.error('Invalid or expired shortened URL');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Go to URL</h1>
          <button
            onClick={() => router.push('/')}
            className="text-blue-500 hover:text-blue-600"
          >
            Back to Home
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Enter shortened URL code"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              status={error ? 'error' : ''}
            />
            {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Go to URL
          </button>
        </form>
      </div>
    </div>
  );
} 