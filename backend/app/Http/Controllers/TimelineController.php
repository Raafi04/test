<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TimelineController extends Controller
{
    public function index(Request $request)
    {
        $timelines = $request->user()->timelines()->latest()->get();

        return response()->json($timelines);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'year' => ['required', 'integer', 'min:1900', 'max:2100'],
        ]);

        $timeline = $request->user()->timelines()->create($data);

        return response()->json($timeline, 201);
    }

    public function update(Request $request, int $id)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'year' => ['required', 'integer', 'min:1900', 'max:2100'],
        ]);

        $timeline = $request->user()->timelines()->findOrFail($id);
        $timeline->update($data);

        return response()->json($timeline);
    }

    public function destroy(Request $request, int $id)
    {
        $timeline = $request->user()->timelines()->findOrFail($id);
        $timeline->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
