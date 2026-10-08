import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from './Button';
import Card from './Card';
import clsx from 'clsx';

const postSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be 100 characters or less'),
  content: z.string().min(1, 'Content is required').max(2000, 'Content must be 2000 characters or less'),
  excerpt: z.string().max(200, 'Excerpt must be 200 characters or less').optional(),
  tags: z.string().max(100, 'Tags must be 100 characters or less').optional()
});

const PostForm = ({ post, onSubmit, loading = false, className = '' }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty }
  } = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      content: '',
      excerpt: '',
      tags: ''
    }
  });

  useEffect(() => {
    if (post) {
      reset({
        title: post.title || '',
        content: post.content || '',
        excerpt: post.excerpt || '',
        tags: post.tags?.join(', ') || ''
      });
    } else {
      reset({
        title: '',
        content: '',
        excerpt: '',
        tags: ''
      });
    }
  }, [post, reset]);

  const onFormSubmit = (data) => {
    const processedData = {
      ...data,
      tags: data.tags
        ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : []
    };
    onSubmit(processedData);
  };

  return (
    <Card className={clsx('max-w-3xl mx-auto', className)}>
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            id="title"
            {...register('title')}
            className={clsx(
              'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500',
              errors.title ? 'border-red-300' : 'border-gray-300'
            )}
            placeholder="Post title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
            Excerpt (optional)
          </label>
          <textarea
            id="excerpt"
            {...register('excerpt')}
            rows={2}
            className={clsx(
              'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500',
              errors.excerpt ? 'border-red-300' : 'border-gray-300'
            )}
            placeholder="Short summary of your post"
          />
          {errors.excerpt && (
            <p className="mt-1 text-sm text-red-600">{errors.excerpt.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            id="content"
            {...register('content')}
            rows={10}
            className={clsx(
              'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500',
              errors.content ? 'border-red-300' : 'border-gray-300'
            )}
            placeholder="Write your post content here..."
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
            Tags (optional, comma separated)
          </label>
          <input
            id="tags"
            {...register('tags')}
            className={clsx(
              'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500',
              errors.tags ? 'border-red-300' : 'border-gray-300'
            )}
            placeholder="e.g. react, javascript, webdev"
          />
          {errors.tags && (
            <p className="mt-1 text-sm text-red-600">{errors.tags.message}</p>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => reset()}
            disabled={!isDirty || loading}
          >
            Reset
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={!isDirty || loading}
          >
            {loading ? 'Saving...' : post ? 'Update Post' : 'Create Post'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

PostForm.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.string,
    excerpt: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string)
  }),
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  className: PropTypes.string
};

export default PostForm;