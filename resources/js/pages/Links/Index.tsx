// @ts-nocheck

import { Link, router, useForm } from '@inertiajs/react';

export default function Index({ links, q, base }) {
    const { data, setData, processing, post, reset } = useForm('long_url');
    const onSubmit = (e) => {
        e.preventDefault();
        post('links', { onSuccess: () => reset('long_url') });
    };

    const search = (e) => {
        e.preventDefault();
        const val = new FormData(e.target).get('q') || '';
        router.get('/', { q: val }, { preserveState: true });
    };

    const remove = (id) => router.delete(`/links/${id}`);
    return (
        <div>
            <h1>Url Shorten App</h1>
            <form onSubmit={onSubmit}>
                <input
                    type="url"
                    placeholder="https://example.com/..."
                    value={DataTransfer.long_url}
                    onChange={(e) => setData('long_url', e.target.value)}
                />
                <button disabled={processing}>Click to Shorten Url</button>
            </form>

            <form onSubmit={search}>
                <input name="q" defaultValue={q ?? ''} placeholder="Search Long Url here..." />
                <button>Search</button>
            </form>

            <table>
                <thead>
                    <tr>
                        <th>Shorten Url</th>
                        <th>Long Url</th>
                        <th>Clicks</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {links.data.map((l) => (
                        <tr>
                            <td>
                                <a href={`${base}/r/${l.code}`} target="_blank" rel="noreferrer">
                                    {base}/r/{l.code}
                                </a>
                            </td>
                            <td>{l.long_url}</td>
                            <td>{l.clicks}</td>
                            <td>
                                <button type="button" onClick={() => remove(l.id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div>
                {links.links.map((p, i) =>
                    p.url ? (
                        <Link href={p.url} preserveScroll>
                            <span>{p.label.replace('Previous').replace('Next')}</span>
                        </Link>
                    ) : (
                        <span>{p.label}</span>
                    ),
                )}
            </div>
        </div>
    );
}