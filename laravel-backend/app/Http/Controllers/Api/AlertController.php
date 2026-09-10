<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Alert;
use Illuminate\Http\Request;

class AlertController extends Controller
{
    /**
     * PATCH /api/alerts/{alert}/read
     * Mirrors App.jsx's toggleAlertRead(id, markRead). Body: { read?: boolean }
     * If "read" is omitted, the current value is flipped (matches the frontend's toggle behavior).
     */
    public function update(Request $request, Alert $alert)
    {
        $data = $request->validate(['read' => 'sometimes|boolean']);
        $alert->read = $data['read'] ?? ! $alert->read;
        $alert->save();

        return response()->json($alert);
    }

    /**
     * POST /api/alerts/read-all
     * Mirrors App.jsx's markAllRead().
     */
    public function readAll()
    {
        Alert::query()->update(['read' => true]);

        return response()->json(['status' => 'ok']);
    }
}
