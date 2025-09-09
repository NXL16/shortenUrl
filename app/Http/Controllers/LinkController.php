<?php

namespace App\Http\Controllers;

use App\Models\Link;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;

class LinkController extends Controller
{
    public function index(Request $request): Response
    {

        $q = $request->get('q');
        $links = Link::when($q, fn($qr)
        => $qr->where('long_url', 'ilike', '%$q%'))
            ->orderByDesc('updated_at')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Links/Index', [
            "links" => $links,
            "q" => $q,
            "base" => config('app.url'), // mục đích hiển thị short url
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'long_url' => ['required', 'url', 'max:2048'],
        ]);

        $code = $this->uniqueCode();

        $link = Link::create([
            'code' => $code,
            'long_url' => $data['long_url'],
            'clicks' => 0
        ]);

        return redirect()->route('links.index')->with('success', 'Created!');
    }

    public function destroy(Link $link)
    {
        $link->delete();
        return back()->with('success', 'Deleted!');
    }

    public function uniqueCode(int $len = 6): string
    {
        do {
            $code = Str::lower(Str::random($len));
        } while (Link::where('code', $code)->exists());

        return $code;
    }
}
