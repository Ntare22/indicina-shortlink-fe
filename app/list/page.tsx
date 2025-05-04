'use client';

import { useEffect, useState } from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface UrlData {
  slug: string;
  originalUrl: string;
  totalClicks: number;
  createdAt: string;
  status: {
    isActive: boolean;
  };
}

export default function ListPage() {
  const router = useRouter();
  const [urls, setUrls] = useState<UrlData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/list`);
        const data = await response.json();
        setUrls(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch URLs:', error);
        toast.error('Failed to fetch URLs. Please try again later.');
        setLoading(false);
      }
    };

    fetchUrls();
  }, []);

  const columns: ColumnsType<UrlData> = [
    {
      title: 'Short URL',
      dataIndex: 'slug',
      key: 'slug',
      render: (slug) => {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '';
        return (
          <a href={`${baseUrl}/${slug}`} target="_blank" rel="noopener noreferrer">
            {slug}
          </a>
        );
      },
    },
    {
      title: 'Original URL',
      dataIndex: 'originalUrl',
      key: 'originalUrl',
      render: (url) => (
        <a href={url} target="_blank" rel="noopener noreferrer" className="truncate block max-w-xs">
          {url}
        </a>
      ),
    },
    {
      title: 'Clicks',
      dataIndex: 'totalClicks',
      key: 'totalClicks',
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Status',
      dataIndex: ['status', 'isActive'],
      key: 'status',
      render: (isActive) => (
        <span className={`px-2 py-1 rounded-full text-sm ${
          isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Shortened URLs</h1>
        <button
          onClick={() => router.push('/')}
          className="text-blue-500 hover:text-blue-600"
        >
          Back to Home
        </button>
      </div>
      <Table
        columns={columns}
        dataSource={urls}
        loading={loading}
        rowKey="slug"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
} 