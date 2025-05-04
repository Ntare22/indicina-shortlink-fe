'use client';

import { Input } from "antd";
import { Formik } from "formik";
import 'antd/dist/antd.css';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';
import { toast } from 'sonner';

const urlSchema = Yup.object().shape({
  url: Yup.string()
    .url('Please enter a valid URL')
    .required('URL is required')
    .matches(
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
      'Please enter a valid URL'
    ),
});

export default function Home() {
  const router = useRouter();

  return (
    <div>
      <main className="container w-1/2 mx-auto lg:w-1/3">
        <h1 className="text-4xl font-bold text-center">Indicina URL Shortener</h1>
        <div className="mt-10">
          <Formik
            initialValues={{ url: '' }}
            validationSchema={urlSchema}
            onSubmit={async (values, { setSubmitting, setErrors, resetForm }) => {
              try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/encode`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ url: values.url }),
                });

                if (!response.ok) {
                  throw new Error('Failed to shorten URL');
                }

                // const data = await response.json();
                toast.success('URL shortened successfully!');
                resetForm();
                router.push('/list');
              } catch (error) {
                console.error('Failed to shorten URL:', error);
                toast.error('Failed to shorten URL. Please try again.');
                setErrors({ url: 'Failed to shorten URL' });
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ handleSubmit, handleChange, handleBlur, values, errors, touched }) => (
              <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                  <Input 
                    placeholder="Enter your URL" 
                    name="url"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.url}
                    status={touched.url && errors.url ? 'error' : ''}
                  />
                  {touched.url && errors.url && (
                    <div className="text-red-500 text-sm">{errors.url}</div>
                  )}
                </div>
                <div className="flex justify-center py-2">
                  <button 
                    type="submit" 
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Shorten
                  </button>
                </div>
              </form>
            )}
          </Formik>
        </div>
        <div className="mt-8 flex justify-center gap-4">
          <button 
            onClick={() => router.push('/list')}
            className="text-blue-500 hover:text-blue-600"
          >
            View All URLs
          </button>
          <button 
            onClick={() => router.push('/redirect')}
            className="text-blue-500 hover:text-blue-600"
          >
            Go to URL
          </button>
        </div>
      </main>
    </div>
  );
}
